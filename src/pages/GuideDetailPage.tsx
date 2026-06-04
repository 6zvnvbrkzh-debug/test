import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import { useGuideBySlug } from "@/hooks/useGuides";
import { Loader2, Clock, ChevronLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const BASE_URL = "https://b-electronics.shop";

export default function GuideDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: guide, isLoading } = useGuideBySlug(slug);

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-20 flex items-center justify-center text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!guide) {
    return (
      <Layout>
        <SEOHead title="Ratgeber nicht gefunden" description="Dieser Ratgeber existiert nicht oder wurde entfernt." noindex />
        <div className="container py-20 text-center">
          <BookOpen className="h-10 w-10 mx-auto text-muted-foreground/40 mb-4" />
          <h1 className="text-xl font-bold mb-2">Ratgeber nicht gefunden</h1>
          <Link to="/faq?tab=ratgeber">
            <Button variant="link">Zurück zur Übersicht</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.excerpt,
    image: guide.cover_image_url ? [guide.cover_image_url] : undefined,
    datePublished: guide.published_at ?? guide.created_at,
    dateModified: guide.updated_at,
    author: { "@type": "Organization", name: "Barbato Electronics" },
    publisher: {
      "@type": "Organization",
      name: "Barbato Electronics",
      logo: { "@type": "ImageObject", url: `${BASE_URL}/images/b-electronics-logo.webp` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}/ratgeber/${guide.slug}` },
  };

  return (
    <Layout>
      <SEOHead
        title={guide.seo_title ?? guide.title}
        description={guide.seo_description ?? guide.excerpt}
        canonical={`/ratgeber/${guide.slug}`}
        type="article"
        ogImage={guide.cover_image_url ?? undefined}
        jsonLd={articleJsonLd}
      />

      <article className="container py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/faq?tab=ratgeber"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ChevronLeft className="h-4 w-4" />
            Alle Ratgeber
          </Link>

          <header className="mb-8 space-y-4">
            <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-widest">
              <span className="text-primary">{guide.category}</span>
              <span className="text-muted-foreground/50">·</span>
              <span className="text-muted-foreground inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {guide.reading_time_minutes}&nbsp;min Lesezeit
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
              {guide.title}
            </h1>
            {guide.subtitle && (
              <p className="text-lg text-muted-foreground leading-relaxed">{guide.subtitle}</p>
            )}
          </header>

          {guide.cover_image_url && (
            <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-muted/40 mb-10 border border-border/40">
              <img
                src={guide.cover_image_url}
                alt={guide.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div
            className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: guide.content }}
          />

          <div className="mt-16 pt-8 border-t border-border/40 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">War dieser Ratgeber hilfreich?</p>
            <Link to="/kontakt">
              <Button variant="outline" size="sm">
                Frage stellen
              </Button>
            </Link>
          </div>
        </div>
      </article>
    </Layout>
  );
}
