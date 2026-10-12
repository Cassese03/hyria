-- ════════════════════════════════════════════════════════════════════
-- Schedina Hyria · schema Supabase
-- Da incollare una volta nel SQL Editor del progetto (Run).
--
-- Modello: niente account né saldo. Ogni schedina ha una puntata virtuale,
-- un nickname e un'email. Dopo il referto l'email riceve l'esito e gli
-- Hyria Coin vinti; gli HC si sommano per email (classifica e premi).
--
-- Sicurezza:
--  · il browser legge solo il palinsesto; le schedine (che contengono le email)
--    non sono leggibili dalle API, si passa solo da funzioni che non restituiscono email
--  · piazza_schedina ricontrolla quote, orari e limiti anti-abuso
--  · le funzioni dello staff stanno nello schema `private`, non esposto alle API
--  · le email partono dal database (pg_net), mai dal browser
-- ════════════════════════════════════════════════════════════════════

create schema if not exists private;
create extension if not exists pg_net;

-- ───────── palinsesto ─────────

create table public.partite (
  id bigint generated always as identity primary key,
  avversario text not null,
  data_ora timestamptz not null,
  in_casa boolean not null default true,
  luogo text,
  -- bozza: invisibile · aperta: si gioca fino a data_ora · chiusa · refertata · annullata
  stato text not null default 'bozza' check (stato in ('bozza', 'aperta', 'chiusa', 'refertata', 'annullata')),
  created_at timestamptz not null default now()
);

create table public.mercati (
  id bigint generated always as identity primary key,
  partita_id bigint not null references public.partite (id) on delete cascade,
  -- id del giocatore in src/locker/roster.ts (es. '21-cassese')
  giocatore_id text not null,
  tipo text not null check (tipo in ('punti', 'assist', 'rimbalzi', 'triple', 'falli', 'tecnico', 'double-double', 'clutch', 'foul-out', 'combo')),
  gruppo text not null check (gruppo in ('stat', 'special')),
  etichetta text not null,
  descrizione text,
  -- over/under: la linea .5 · combo: soglia punti
  linea numeric(5, 1),
  -- solo combo: soglia della seconda statistica
  linea2 numeric(5, 1),
  stat2 text check (stat2 in ('assist', 'rimbalzi')),
  stato text not null default 'aperto' check (stato in ('aperto', 'sospeso', 'refertato', 'annullato')),
  esito_vincente text,
  unique (partita_id, giocatore_id, tipo)
);
create index mercati_partita_idx on public.mercati (partita_id);

create table public.esiti (
  id bigint generated always as identity primary key,
  mercato_id bigint not null references public.mercati (id) on delete cascade,
  codice text not null check (codice in ('over', 'under', 'si', 'no')),
  etichetta text not null,
  pick text not null,
  quota numeric(6, 2) not null check (quota > 1),
  unique (mercato_id, codice)
);

-- tabellino inserito dallo staff a fine gara: da qui si refertano i mercati
create table public.statistiche (
  partita_id bigint not null references public.partite (id) on delete cascade,
  giocatore_id text not null,
  punti int not null default 0 check (punti >= 0),
  assist int not null default 0 check (assist >= 0),
  rimbalzi int not null default 0 check (rimbalzi >= 0),
  triple int not null default 0 check (triple >= 0),
  falli int not null default 0 check (falli between 0 and 5),
  tecnici int not null default 0 check (tecnici between 0 and 2),
  clutch boolean not null default false,
  primary key (partita_id, giocatore_id)
);

-- ───────── schedine ─────────

create table public.schedine (
  id bigint generated always as identity primary key,
  codice text not null unique,
  -- chiave segreta salvata solo nel browser di chi ha giocato: serve a rileggere le proprie schedine
  token uuid not null unique default gen_random_uuid(),
  nickname text not null check (nickname ~ '^[A-Za-z0-9_.-]{3,20}$'),
  -- null dopo una richiesta di cancellazione (private.cancella_email)
  email text check (email = lower(email)),
  stake int not null check (stake in (10, 25, 50, 100)),
  quota_base numeric not null,
  bonus_pct int not null default 0,
  quota_totale numeric not null,
  vincita_potenziale int not null,
  -- HC assegnati alla chiusura (0 se persa o annullata)
  vincita int,
  stato text not null default 'in_corso' check (stato in ('in_corso', 'vinta', 'persa', 'annullata')),
  created_at timestamptz not null default now(),
  chiusa_at timestamptz
);
create index schedine_email_idx on public.schedine (email, created_at desc);

create table public.selezioni (
  schedina_id bigint not null references public.schedine (id) on delete cascade,
  -- niente cascade: una partita con giocate non si può cancellare per sbaglio
  mercato_id bigint not null references public.mercati (id),
  esito_id bigint not null references public.esiti (id),
  -- quota bloccata al momento della giocata
  quota numeric(6, 2) not null,
  stato text not null default 'in_corso' check (stato in ('in_corso', 'vinta', 'persa', 'annullata')),
  primary key (schedina_id, mercato_id)
);
create index selezioni_mercato_idx on public.selezioni (mercato_id);

-- ───────── tabelle interne ─────────

-- configurazione invio email (vedi README)
create table private.config (
  chiave text primary key,
  valore text not null
);
insert into private.config (chiave, valore) values
  ('email_endpoint', 'https://send-email-nine-pi.vercel.app/api/send-email'),
  ('email_from', 'info@hyriabasket.it'),
  -- se l'endpoint richiede un segreto: nome e valore dell'header (lasciare vuoti altrimenti)
  ('email_header_nome', ''),
  ('email_header_valore', ''),
  -- sale per l'hash degli IP nel limite anti-abuso
  ('sale_ip', md5(random()::text || clock_timestamp()::text));

-- una sola email di esito per indirizzo e partita
create table private.email_inviate (
  email text not null,
  partita_id bigint not null references public.partite (id) on delete cascade,
  richiesta_id bigint,
  inviata_at timestamptz not null default now(),
  primary key (email, partita_id)
);

-- anti-abuso: hash dell'IP (mai l'IP in chiaro), conservato un'ora
create table private.tentativi (
  ip_hash text not null,
  at timestamptz not null default now()
);
create index tentativi_idx on private.tentativi (ip_hash, at);

-- ───────── accessi (RLS) ─────────

alter table public.partite enable row level security;
alter table public.mercati enable row level security;
alter table public.esiti enable row level security;
alter table public.statistiche enable row level security;
alter table public.schedine enable row level security;
alter table public.selezioni enable row level security;

-- nessuna scrittura diretta dalle API; schedine e selezioni nemmeno in lettura (contengono le email)
revoke insert, update, delete, truncate on
  public.partite, public.mercati, public.esiti, public.statistiche, public.schedine, public.selezioni
from anon, authenticated;
revoke select on public.schedine, public.selezioni from anon, authenticated;

create policy "palinsesto visibile" on public.partite
  for select to anon, authenticated
  using (stato <> 'bozza');

create policy "mercati visibili" on public.mercati
  for select to anon, authenticated
  using (exists (select 1 from public.partite p where p.id = partita_id and p.stato <> 'bozza'));

create policy "esiti visibili" on public.esiti
  for select to anon, authenticated
  using (exists (
    select 1 from public.mercati m join public.partite p on p.id = m.partita_id
    where m.id = mercato_id and p.stato <> 'bozza'
  ));

create policy "tabellini visibili" on public.statistiche
  for select to anon, authenticated
  using (exists (select 1 from public.partite p where p.id = partita_id and p.stato <> 'bozza'));

-- ───────── regole di gioco ─────────

create or replace function private.bonus_pct(n int)
returns int
language sql
immutable
as $$
  select case when n >= 7 then 20 when n >= 5 then 10 when n >= 3 then 5 else 0 end
$$;

create or replace function private.html(t text)
returns text
language sql
immutable
as $$
  select replace(replace(replace(replace(coalesce(t, ''), '&', '&amp;'), '<', '&lt;'), '>', '&gt;'), '"', '&quot;')
$$;

-- ───────── funzioni chiamabili dal sito ─────────

-- p_selezioni: [{ "esito": 123, "quota": 1.85 }, ...]
-- la quota inviata serve solo a capire se nel frattempo è cambiata: vale quella del database
create or replace function public.piazza_schedina(p_selezioni jsonb, p_stake int, p_nickname text, p_email text)
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_nick text := btrim(coalesce(p_nickname, ''));
  v_email text := lower(btrim(coalesce(p_email, '')));
  v_ip text;
  v_ip_hash text;
  v_n int;
  v_row record;
  v_base numeric := 1;
  v_bonus int;
  v_totale numeric;
  v_vincita int;
  v_codice text;
  v_tentativi int := 0;
  v_id bigint;
  v_token uuid;
begin
  if v_nick !~ '^[A-Za-z0-9_.-]{3,20}$' then
    raise exception 'nickname_non_valido';
  end if;
  if length(v_email) > 254 or v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$' then
    raise exception 'email_non_valida';
  end if;
  if p_stake is null or p_stake not in (10, 25, 50, 100) then
    raise exception 'stake_non_valido';
  end if;
  if p_selezioni is null or jsonb_typeof(p_selezioni) <> 'array' or jsonb_array_length(p_selezioni) = 0 then
    raise exception 'schedina_vuota';
  end if;
  v_n := jsonb_array_length(p_selezioni);
  if v_n > 15 then
    raise exception 'troppi_eventi';
  end if;

  -- anti-abuso: massimo 10 schedine al giorno per email e 30 l'ora per rete
  if (select count(*) from public.schedine where email = v_email and created_at > now() - interval '1 day') >= 10 then
    raise exception 'limite_email';
  end if;
  v_ip := split_part(coalesce(current_setting('request.headers', true)::json ->> 'x-forwarded-for', ''), ',', 1);
  if v_ip <> '' then
    v_ip_hash := md5(btrim(v_ip) || (select valore from private.config where chiave = 'sale_ip'));
    delete from private.tentativi where at < now() - interval '1 hour';
    if (select count(*) from private.tentativi where ip_hash = v_ip_hash) >= 30 then
      raise exception 'limite_rete';
    end if;
    insert into private.tentativi (ip_hash) values (v_ip_hash);
  end if;

  for v_row in
    select
      (s ->> 'quota')::numeric as quota_client,
      e.id as esito_id,
      e.quota,
      m.stato as stato_mercato,
      p.stato as stato_partita,
      p.data_ora
    from jsonb_array_elements(p_selezioni) s
    left join public.esiti e on e.id = (s ->> 'esito')::bigint
    left join public.mercati m on m.id = e.mercato_id
    left join public.partite p on p.id = m.partita_id
  loop
    if v_row.esito_id is null or v_row.stato_mercato <> 'aperto' then
      raise exception 'mercato_non_disponibile';
    end if;
    if v_row.stato_partita <> 'aperta' or v_row.data_ora <= now() then
      raise exception 'partita_chiusa';
    end if;
    if v_row.quota_client is distinct from v_row.quota then
      raise exception 'quote_cambiate';
    end if;
    v_base := v_base * v_row.quota;
  end loop;

  -- un solo esito per mercato (niente Over e Under insieme)
  if (
    select count(distinct e.mercato_id)
    from jsonb_array_elements(p_selezioni) s
    join public.esiti e on e.id = (s ->> 'esito')::bigint
  ) <> v_n then
    raise exception 'esiti_duplicati';
  end if;

  v_bonus := private.bonus_pct(v_n);
  v_totale := round(v_base * (1 + v_bonus / 100.0), 2);
  v_vincita := least(round(v_totale * p_stake), 100000)::int;

  loop
    v_tentativi := v_tentativi + 1;
    v_codice := 'HYR-' || extract(year from now())::int || '-' ||
      case when v_tentativi <= 30
        then (1000 + floor(random() * 9000))::int::text
        else (100000 + floor(random() * 900000))::int::text
      end;
    exit when not exists (select 1 from public.schedine where codice = v_codice);
  end loop;

  insert into public.schedine (codice, nickname, email, stake, quota_base, bonus_pct, quota_totale, vincita_potenziale)
  values (v_codice, v_nick, v_email, p_stake, round(v_base, 2), v_bonus, v_totale, v_vincita)
  returning id, token into v_id, v_token;

  insert into public.selezioni (schedina_id, mercato_id, esito_id, quota)
  select v_id, e.mercato_id, e.id, e.quota
  from jsonb_array_elements(p_selezioni) s
  join public.esiti e on e.id = (s ->> 'esito')::bigint;

  return json_build_object('codice', v_codice, 'token', v_token);
end;
$$;

-- le schedine giocate da questo browser (i token sono salvati in localStorage); mai l'email
create or replace function public.le_mie_schedine(p_token uuid[])
returns json
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(json_agg(t order by t.created_at desc), '[]'::json)
  from (
    select
      s.codice, s.token, s.nickname, s.created_at, s.stake, s.quota_base, s.bonus_pct,
      s.quota_totale, s.vincita_potenziale, s.vincita, s.stato,
      (
        select json_agg(json_build_object(
          'mercato_id', sel.mercato_id, 'esito_id', sel.esito_id, 'quota', sel.quota, 'stato', sel.stato,
          'codice', e.codice, 'pick', e.pick, 'giocatore_id', m.giocatore_id, 'etichetta', m.etichetta
        ) order by sel.mercato_id)
        from public.selezioni sel
        join public.esiti e on e.id = sel.esito_id
        join public.mercati m on m.id = sel.mercato_id
        where sel.schedina_id = s.id
      ) as selezioni
    from public.schedine s
    where s.token = any (p_token[1:50])
  ) t
$$;

-- classifica pubblica: HC vinti per email, mostrati con l'ultimo nickname usato
create or replace function public.classifica(p_limite int default 10)
returns json
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(json_agg(c order by c.hyria_coin desc, c.nickname), '[]'::json)
  from (
    select (array_agg(nickname order by created_at desc))[1] as nickname, sum(vincita)::int as hyria_coin
    from public.schedine
    where email is not null and stato = 'vinta'
    group by email
    order by sum(vincita) desc
    limit least(greatest(coalesce(p_limite, 10), 1), 50)
  ) c
$$;

-- ───────── funzioni dello staff (solo SQL Editor) ─────────

-- chiude la schedina quando tutte le selezioni sono decise; le annullate valgono 1.00
create or replace function private.chiudi_schedina(p_id bigint)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_s public.schedine%rowtype;
  v_aperte int;
  v_perse int;
  v_vinte int;
  v_quota numeric := 1;
  v_q numeric;
begin
  select * into v_s from public.schedine where id = p_id for update;
  if not found or v_s.stato <> 'in_corso' then
    return;
  end if;

  select
    count(*) filter (where stato = 'in_corso'),
    count(*) filter (where stato = 'persa'),
    count(*) filter (where stato = 'vinta')
  into v_aperte, v_perse, v_vinte
  from public.selezioni where schedina_id = p_id;

  if v_perse > 0 then
    update public.schedine set stato = 'persa', vincita = 0, chiusa_at = now() where id = p_id;
  elsif v_aperte > 0 then
    return;
  elsif v_vinte = 0 then
    update public.schedine set stato = 'annullata', vincita = 0, chiusa_at = now() where id = p_id;
  else
    for v_q in select quota from public.selezioni where schedina_id = p_id and stato = 'vinta' loop
      v_quota := v_quota * v_q;
    end loop;
    v_quota := round(v_quota * (1 + private.bonus_pct(v_vinte) / 100.0), 2);
    update public.schedine
      set stato = 'vinta', vincita = least(round(v_quota * v_s.stake), 100000)::int, chiusa_at = now()
      where id = p_id;
  end if;
end;
$$;

-- referta tutti i mercati della partita leggendo `statistiche`;
-- un giocatore senza tabellino (non ha giocato) ha i mercati annullati
create or replace function private.referta_partita(p_partita bigint)
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_m public.mercati%rowtype;
  v_st public.statistiche%rowtype;
  v_win text;
  v_val numeric;
  v_ref int := 0;
  v_ann int := 0;
  v_sched int := 0;
  v_sid bigint;
begin
  if not exists (select 1 from public.partite where id = p_partita and stato in ('aperta', 'chiusa')) then
    raise exception 'partita_non_refertabile: deve essere aperta o chiusa';
  end if;
  update public.partite set stato = 'chiusa' where id = p_partita;

  for v_m in select * from public.mercati where partita_id = p_partita and stato in ('aperto', 'sospeso') loop
    select * into v_st from public.statistiche where partita_id = p_partita and giocatore_id = v_m.giocatore_id;
    if not found then
      update public.mercati set stato = 'annullato' where id = v_m.id;
      update public.selezioni set stato = 'annullata' where mercato_id = v_m.id;
      v_ann := v_ann + 1;
      continue;
    end if;

    v_val := case v_m.tipo
      when 'punti' then v_st.punti
      when 'assist' then v_st.assist
      when 'rimbalzi' then v_st.rimbalzi
      when 'triple' then v_st.triple
      when 'falli' then v_st.falli
    end;

    v_win := case v_m.tipo
      when 'tecnico' then case when v_st.tecnici > 0 then 'si' else 'no' end
      when 'double-double' then case when v_st.punti >= 10 and (v_st.rimbalzi >= 10 or v_st.assist >= 10) then 'si' else 'no' end
      when 'clutch' then case when v_st.clutch then 'si' else 'no' end
      when 'foul-out' then case when v_st.falli >= 5 then 'si' else 'no' end
      when 'combo' then case
        when v_st.punti >= v_m.linea
          and (case v_m.stat2 when 'assist' then v_st.assist else v_st.rimbalzi end) >= v_m.linea2
        then 'si' else 'no' end
      else case when v_val > v_m.linea then 'over' else 'under' end
    end;

    update public.mercati set stato = 'refertato', esito_vincente = v_win where id = v_m.id;
    update public.selezioni sel
      set stato = case when e.codice = v_win then 'vinta' else 'persa' end
      from public.esiti e
      where e.id = sel.esito_id and sel.mercato_id = v_m.id;
    v_ref := v_ref + 1;
  end loop;

  for v_sid in
    select distinct sel.schedina_id
    from public.selezioni sel join public.mercati m on m.id = sel.mercato_id
    where m.partita_id = p_partita
  loop
    perform private.chiudi_schedina(v_sid);
    v_sched := v_sched + 1;
  end loop;

  update public.partite set stato = 'refertata' where id = p_partita;
  return json_build_object('mercati_refertati', v_ref, 'mercati_annullati', v_ann, 'schedine_controllate', v_sched);
end;
$$;

-- partita rinviata o cancellata: annulla tutti i mercati
create or replace function private.annulla_partita(p_partita bigint)
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_sid bigint;
  v_sched int := 0;
begin
  update public.mercati set stato = 'annullato' where partita_id = p_partita and stato in ('aperto', 'sospeso');
  update public.selezioni sel set stato = 'annullata'
    from public.mercati m
    where m.id = sel.mercato_id and m.partita_id = p_partita and sel.stato = 'in_corso';
  for v_sid in
    select distinct sel.schedina_id
    from public.selezioni sel join public.mercati m on m.id = sel.mercato_id
    where m.partita_id = p_partita
  loop
    perform private.chiudi_schedina(v_sid);
    v_sched := v_sched + 1;
  end loop;
  update public.partite set stato = 'annullata' where id = p_partita;
  return json_build_object('schedine_controllate', v_sched);
end;
$$;

-- invio di una email tramite l'endpoint configurato (asincrono, via pg_net)
create or replace function private.invia_email(p_to text, p_oggetto text, p_html text)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_url text := (select valore from private.config where chiave = 'email_endpoint');
  v_from text := (select valore from private.config where chiave = 'email_from');
  v_hnome text := (select valore from private.config where chiave = 'email_header_nome');
  v_hvalore text := (select valore from private.config where chiave = 'email_header_valore');
  v_headers jsonb := jsonb_build_object('Content-Type', 'application/json');
begin
  if coalesce(v_hnome, '') <> '' then
    v_headers := v_headers || jsonb_build_object(v_hnome, v_hvalore);
  end if;
  return net.http_post(
    url := v_url,
    body := jsonb_build_object('to', p_to, 'from', v_from, 'subject', p_oggetto, 'html', p_html),
    headers := v_headers
  );
end;
$$;

-- dopo il referto: una email per indirizzo con l'esito delle sue schedine e gli HC totali.
-- Si può rilanciare: chi l'ha già ricevuta per questa partita non la riceve di nuovo.
create or replace function private.invia_esiti(p_partita bigint)
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_p public.partite%rowtype;
  v_email text;
  v_righe text;
  v_vinti int;
  v_totale int;
  v_nick text;
  v_titolo text;
  v_html text;
  v_inviate int := 0;
begin
  select * into v_p from public.partite where id = p_partita;
  if not found or v_p.stato <> 'refertata' then
    raise exception 'partita_non_refertata: esegui prima private.referta_partita';
  end if;
  v_titolo := case when v_p.in_casa then 'Hyria Basket – ' || v_p.avversario else v_p.avversario || ' – Hyria Basket' end;

  for v_email in
    select distinct s.email
    from public.schedine s
    join public.selezioni sel on sel.schedina_id = s.id
    join public.mercati m on m.id = sel.mercato_id
    where m.partita_id = p_partita and s.email is not null and s.stato <> 'in_corso'
      and not exists (select 1 from private.email_inviate ei where ei.email = s.email and ei.partita_id = p_partita)
  loop
    select
      string_agg(format(
        '<tr><td style="padding:8px 0;font-family:monospace">#%s</td><td>%s</td><td style="text-align:right;font-weight:700">%s</td></tr>',
        s.codice,
        case s.stato when 'vinta' then 'Vinta' when 'persa' then 'Persa' else 'Annullata' end,
        case when s.stato = 'vinta' then '+' || s.vincita || ' HC' else '0 HC' end
      ), '' order by s.created_at),
      coalesce(sum(s.vincita), 0)::int,
      (array_agg(s.nickname order by s.created_at desc))[1]
    into v_righe, v_vinti, v_nick
    from public.schedine s
    where s.email = v_email and s.stato <> 'in_corso'
      and exists (
        select 1 from public.selezioni sel join public.mercati m on m.id = sel.mercato_id
        where sel.schedina_id = s.id and m.partita_id = p_partita
      );

    select coalesce(sum(vincita), 0)::int into v_totale
    from public.schedine where email = v_email and stato = 'vinta';

    v_html := format(
      '<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;color:#111">'
      '<h2 style="margin:0 0 4px">Ciao %s, ecco com''è andata</h2>'
      '<p style="margin:0 0 16px;color:#555">%s</p>'
      '<table style="width:100%%;border-collapse:collapse">%s</table>'
      '<p style="font-size:18px;margin:20px 0 4px">Questa partita: <strong>%s HC</strong></p>'
      '<p style="margin:0 0 20px">Totale stagione: <strong>%s HC</strong></p>'
      '<p><a href="https://hyriabasket.it/schedina" style="color:#d96c00">Gioca la prossima schedina</a></p>'
      '<p style="font-size:12px;color:#888;margin-top:24px">Ricevi questa email perché hai giocato una schedina su hyriabasket.it con questo indirizzo. '
      'Gli Hyria Coin sono virtuali e non hanno valore in denaro. Per non ricevere più email e cancellare il tuo indirizzo rispondi a questo messaggio.</p>'
      '</div>',
      private.html(v_nick), private.html(v_titolo), v_righe, v_vinti, v_totale
    );

    insert into private.email_inviate (email, partita_id, richiesta_id)
    values (v_email, p_partita, private.invia_email(
      v_email,
      'Schedina Hyria · ' || v_titolo || ': ' || case when v_vinti > 0 then '+' || v_vinti || ' Hyria Coin' else 'esito delle tue schedine' end,
      v_html
    ));
    v_inviate := v_inviate + 1;
  end loop;

  return json_build_object('email_inviate', v_inviate);
end;
$$;

-- diritto alla cancellazione: toglie l'indirizzo da tutte le schedine (restano anonime)
create or replace function private.cancella_email(p_email text)
returns int
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_n int;
begin
  update public.schedine set email = null where email = lower(btrim(p_email));
  get diagnostics v_n = row_count;
  delete from private.email_inviate where email = lower(btrim(p_email));
  return v_n;
end;
$$;

-- ───────── permessi sulle funzioni ─────────
-- Postgres concede EXECUTE a tutti sulle nuove funzioni e Supabase anche ad anon/authenticated:
-- li togliamo e riapriamo solo ciò che serve al sito.

revoke all on schema private from public, anon, authenticated;
revoke all on all tables in schema private from public, anon, authenticated;
revoke execute on all functions in schema private from public, anon, authenticated;

revoke execute on function public.piazza_schedina(jsonb, int, text, text) from public;
revoke execute on function public.le_mie_schedine(uuid[]) from public;
revoke execute on function public.classifica(int) from public;
grant execute on function public.piazza_schedina(jsonb, int, text, text) to anon, authenticated;
grant execute on function public.le_mie_schedine(uuid[]) to anon, authenticated;
grant execute on function public.classifica(int) to anon, authenticated;
