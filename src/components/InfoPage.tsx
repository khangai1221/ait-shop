import type { ReactNode } from "react";

export function InfoPage({
  tag,
  title,
  description,
  children,
}: {
  tag: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <header className="text-center mb-10">
        <p className="text-sm uppercase tracking-wider text-brand">{tag}</p>
        <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl mt-2">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto leading-relaxed">
            {description}
          </p>
        )}
      </header>
      <div className="space-y-6">{children}</div>
    </div>
  );
}

export function InfoSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-border p-6 sm:p-8 bg-card">
      <h2 className="font-display text-xl sm:text-2xl mb-4">{title}</h2>
      <div className="text-sm sm:text-base text-muted-foreground leading-relaxed space-y-3">
        {children}
      </div>
    </section>
  );
}
