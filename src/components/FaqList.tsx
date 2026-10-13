export interface Faq {
  question: string;
  answer: string;
}

/** Domande frequenti apribili una per una (details/summary: funziona anche da tastiera) */
const FaqList = ({ faqs }: { faqs: Faq[] }) => (
  <div className="hy-faq">
    {faqs.map((f) => (
      <details key={f.question}>
        <summary>{f.question}</summary>
        <p>{f.answer}</p>
      </details>
    ))}
  </div>
);

export default FaqList;
