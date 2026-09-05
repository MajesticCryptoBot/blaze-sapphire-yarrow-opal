import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { DeskPage } from "@/components/desk-page";
import { getDeskSection, isDeskSlug } from "@/lib/desk-sections";

export const Route = createFileRoute("/$slug")({
  loader: ({ params }) => {
    if (!isDeskSlug(params.slug)) throw notFound();
    const section = getDeskSection(params.slug);
    if (!section) throw notFound();
    return { section };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.section.label ?? "Desk"} — ASP News` }],
  }),
  notFoundComponent: DeskMissing,
  component: DeskRoute,
});

function DeskRoute() {
  const { section } = Route.useLoaderData();
  return <DeskPage section={section} />;
}

function DeskMissing() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Link to="/" search={{ q: "" }} className="inline-flex h-11 items-center gap-2 text-sm text-muted hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back
      </Link>
      <p className="mt-8 text-sm text-muted">This desk is not on the roster.</p>
    </main>
  );
}
