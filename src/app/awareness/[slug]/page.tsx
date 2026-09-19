import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LibraryArticle } from "@/components/library-article";
import { getLibraryItem, getLibraryItems } from "@/lib/library";
import { JsonLd, buildLibraryMetadata, buildLibrarySchemas } from "@/lib/library-seo";

type AwarenessPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getLibraryItems("en").map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: AwarenessPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getLibraryItem(slug, "en");

  return item ? buildLibraryMetadata(item) : { title: "Guide not found" };
}

export default async function AwarenessPage({ params }: AwarenessPageProps) {
  const { slug } = await params;
  const item = getLibraryItem(slug, "en");

  if (!item) {
    notFound();
  }

  return (
    <>
      <JsonLd schemas={buildLibrarySchemas(item)} />
      <LibraryArticle item={item} />
    </>
  );
}
