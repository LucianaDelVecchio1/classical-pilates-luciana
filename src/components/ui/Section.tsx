/** Contenedores y encabezados de sección reutilizables. */

export function Section({
  children,
  className,
  tone = "default",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "default" | "sand" | "sea";
  id?: string;
}) {
  const tones = {
    default: "",
    sand: "bg-sand/40",
    sea: "bg-sea-deep text-ivory-soft",
  };
  return (
    <section id={id} className={`${tones[tone]} ${className ?? ""}`}>
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">{children}</div>
    </section>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  intro,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
}) {
  const alignCls = align === "center" ? "text-center mx-auto" : "";
  return (
    <div className={`max-w-2xl ${alignCls}`}>
      {eyebrow && (
        <p className="text-xs uppercase tracking-[0.25em] text-sea-deep">{eyebrow}</p>
      )}
      <h2 className="mt-2 font-display text-3xl md:text-4xl">{title}</h2>
      {intro && <p className="mt-3 text-char-soft leading-relaxed">{intro}</p>}
    </div>
  );
}
