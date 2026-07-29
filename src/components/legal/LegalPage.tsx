import { Section, SectionTitle } from "@/components/ui/Section";

/**
 * Plantilla común de páginas legales. Los textos son placeholders
 * provisionales que deben revisarse por un profesional legal antes
 * del lanzamiento (aviso visible en cada página).
 */
export function LegalPage({
  title,
  reviewNotice,
  sections,
}: {
  title: string;
  reviewNotice: string;
  sections: { title: string; text: string }[];
}) {
  return (
    <Section>
      <SectionTitle title={title} />
      <p className="mt-6 max-w-prose rounded-sm border border-olive bg-olive/10 p-4 text-sm text-char">
        ⚠ {reviewNotice}
      </p>
      <div className="mt-10 max-w-prose space-y-8">
        {sections.map((s) => (
          <div key={s.title}>
            <h2 className="font-display text-2xl">{s.title}</h2>
            <p className="mt-2 leading-relaxed text-char-soft">{s.text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
