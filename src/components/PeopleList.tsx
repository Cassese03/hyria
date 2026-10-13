export interface Person {
  name: string;
  role: string;
}

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('');

/** Elenco di persone come una distinta di gara: monogramma, nome e ruolo */
const PeopleList = ({ people }: { people: Person[] }) => (
  <ul className="hy-people">
    {people.map((p) => (
      <li key={p.name}>
        <span className="hy-people-mono" aria-hidden="true">
          {initials(p.name)}
        </span>
        <span className="hy-people-text">
          <span className="hy-people-name">{p.name}</span>
          <span className="hy-people-role">{p.role}</span>
        </span>
      </li>
    ))}
  </ul>
);

export default PeopleList;
