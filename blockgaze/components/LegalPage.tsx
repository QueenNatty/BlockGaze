import { CONTACT_EMAIL, LEGAL_UPDATED } from "@/lib/site";

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="prose-legal max-w-prose">
      <h1>{title}</h1>
      <p className="text-sm text-muted">Last updated {LEGAL_UPDATED}</p>
      {children}
      {CONTACT_EMAIL && (
        <>
          <h2>Contact</h2>
          <p>
            Questions about this page can be sent to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
        </>
      )}
    </article>
  );
}
