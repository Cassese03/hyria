import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';
import { ROUTES, headProps, postSeo, type RouteSeo } from '../src/seo/routes';
import { AREA_SERVED, CLUB, HOME_VENUE, ISTRUTTORI_FIP, OG_IMAGE, OTHER_VENUES, PARENT_FAQS, SITE_URL, activePrograms } from '../src/seo/site';
import { POSTS } from '../src/storia/posts';

/**
 * SEO in fase di build. Il sito è una SPA: chi non esegue JavaScript (molti crawler
 * AI) vedrebbe solo <div id="root"></div>. Per ogni pagina indicizzabile scriviamo
 * dist/<pagina>/index.html con title, meta, Open Graph, JSON-LD e un riassunto
 * testuale; React, all'avvio, sostituisce il riassunto con la pagina vera.
 * Genera anche sitemap.xml e llms.txt dagli stessi dati.
 */

const HEAD_RE = /<!-- seo:head -->[\s\S]*?<!-- \/seo:head -->/;
const BODY_MARK = '<!-- seo:body -->';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const ld = (o: object) => JSON.stringify(o).replace(/</g, '\\u003c');
const today = () => new Date().toISOString().slice(0, 10);

function headHtml(r: RouteSeo) {
  const h = headProps(r);
  const image = r.ogImage ?? OG_IMAGE.url;
  const isDefault = image === OG_IMAGE.url;
  const type = r.path.startsWith('/storia/') ? 'article' : 'website';
  const tags = [
    `<title>${esc(h.title)}</title>`,
    `<meta name="description" content="${esc(h.description)}" />`,
    h.keywords && `<meta name="keywords" content="${esc(h.keywords)}" />`,
    `<link rel="canonical" href="${h.canonicalUrl}" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:site_name" content="Hyria Basket" />`,
    `<meta property="og:locale" content="it_IT" />`,
    `<meta property="og:title" content="${esc(h.title)}" />`,
    `<meta property="og:description" content="${esc(h.description)}" />`,
    `<meta property="og:url" content="${h.ogUrl}" />`,
    `<meta property="og:image" content="${image}" />`,
    isDefault && `<meta property="og:image:width" content="${OG_IMAGE.width}" />`,
    isDefault && `<meta property="og:image:height" content="${OG_IMAGE.height}" />`,
    `<meta property="og:image:alt" content="${esc(isDefault ? OG_IMAGE.alt : h.title)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(h.title)}" />`,
    `<meta name="twitter:description" content="${esc(h.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<script type="application/ld+json">${ld(r.structuredData)}</script>`,
  ];
  return `<!-- seo:head -->\n    ${tags.filter(Boolean).join('\n    ')}\n    <!-- /seo:head -->`;
}

function bodyHtml(r: RouteSeo, nav: RouteSeo[]) {
  const faqs = r.faqs?.length
    ? `<section><h2>Domande frequenti</h2><dl>${r.faqs.map((f) => `<dt>${esc(f.question)}</dt><dd>${esc(f.answer)}</dd>`).join('')}</dl></section>`
    : '';
  const links = nav.map((n) => `<li><a href="${n.path}">${esc(n.h1)}</a></li>`).join('');
  return `<main class="seo-static"><h1>${esc(r.h1)}</h1>${r.text.map((t) => `<p>${esc(t)}</p>`).join('')}${faqs}<nav aria-label="Pagine del sito"><ul>${links}</ul></nav></main>`;
}

function sitemap(routes: RouteSeo[]) {
  const urls = routes.map(
    (r) =>
      `  <url>\n    <loc>${SITE_URL}${r.path === '/' ? '/' : r.path}</loc>\n    <lastmod>${r.lastmod ?? today()}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority.toFixed(1)}</priority>\n  </url>`,
  );
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}

/** llms.txt (llmstxt.org): chi siamo, in Markdown, per gli agenti AI */
function llmsTxt(routes: RouteSeo[]) {
  const venues = [HOME_VENUE, ...OTHER_VENUES]
    .map((v) => `- ${v.name}: ${v.streetAddress}, ${v.postalCode} ${v.locality} (${v.region}) – coordinate ${v.geo.latitude}, ${v.geo.longitude}`)
    .join('\n');
  const programs = activePrograms()
    .map((p) => `- **${p.name}** (${p.ages}): ${p.description}`)
    .join('\n');
  const faqs = PARENT_FAQS.map((f) => `### ${f.question}\n\n${f.answer}`).join('\n\n');
  const pages = routes
    .filter((r) => !r.path.startsWith('/storia/') && r.path !== '/privacy-policy')
    .map((r) => `- [${r.h1}](${SITE_URL}${r.path === '/' ? '' : r.path}): ${r.description}`)
    .join('\n');
  return `# ${CLUB.legalName}

> Società di pallacanestro di Nola (NA), fondata nel ${CLUB.foundingYear}. Minibasket per bambini dai 5 agli 11 anni e prima squadra nel campionato regionale, punto di riferimento per il basket nell'Agro Nolano.

## Chi siamo

${CLUB.legalName} nasce a Nola nel ${CLUB.foundingYear} da un gruppo di giovani imprenditori appassionati di basket e del proprio territorio. Il nome richiama Hyria, l'antica città che sorgeva nell'area nolana. Valori: passione, comunità, crescita tecnica e umana di ogni atleta. Motto: "Giovane. Audace. Radicata."

## Dove

${venues}
- Zona servita: ${AREA_SERVED.join(', ')} e Agro Nolano.

## Attività

${programs}

Il minibasket prevede 2 allenamenti a settimana, gruppi divisi per età e fino a 3 allenamenti di prova gratuiti.${ISTRUTTORI_FIP ? ' Gli istruttori hanno qualifica FIP.' : ''}

## Iscrizioni e contatti

- Documenti: modulo di iscrizione compilato e certificato medico sportivo valido.
- Telefono: ${CLUB.phones.join(', ')}
- Email: ${CLUB.email}
- Instagram: ${CLUB.sameAs[0]}

## Domande frequenti

${faqs}

## Pagine

${pages}
`;
}

export function seoPrerender(): Plugin {
  let outDir = 'dist';
  return {
    name: 'hyria-seo-prerender',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const template = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8');
      if (!HEAD_RE.test(template) || !template.includes(BODY_MARK)) {
        throw new Error('[seo] index.html senza i segnaposto seo:head / seo:body');
      }
      const visible = ROUTES.filter((r) => !r.hidden);
      const withPosts = ROUTES.some((r) => r.path === '/storia' && !r.hidden);
      const all = withPosts ? [...visible, ...POSTS.map(postSeo)] : visible;
      const nav = visible.filter((r) => r.path !== '/privacy-policy');

      for (const r of all) {
        const html = template.replace(HEAD_RE, headHtml(r)).replace(BODY_MARK, bodyHtml(r, nav));
        const file = r.path === '/' ? path.join(outDir, 'index.html') : path.join(outDir, r.path.slice(1), 'index.html');
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, html);
      }
      fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemap(all));
      fs.writeFileSync(path.join(outDir, 'llms.txt'), llmsTxt(all));
      console.log(`[seo] ${all.length} pagine prerenderizzate, sitemap.xml e llms.txt generati`);
    },
  };
}
