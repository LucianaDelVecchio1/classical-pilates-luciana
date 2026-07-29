/**
 * Acordeón de FAQ accesible con <details>/<summary> nativos.
 * El schema FAQPage se genera aparte, SOLO en páginas donde las
 * preguntas y respuestas son visibles (requisito de Google).
 */
export function FaqList({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  return (
    <div className="divide-y divide-stone/60 border-y border-stone/60">
      {items.map((item) => (
        <details key={item.question} className="group py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-medium marker:hidden [&::-webkit-details-marker]:hidden">
            <span>{item.question}</span>
            <span
              aria-hidden="true"
              className="text-sea-deep transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-3 max-w-prose text-char-soft leading-relaxed">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
