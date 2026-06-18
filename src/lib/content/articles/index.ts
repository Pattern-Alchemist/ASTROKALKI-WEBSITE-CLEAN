/**
 * Combined article index — exports all 20 cluster articles
 * and provides helpers for looking them up.
 */

import type { Article } from "../article-types";
import { RELATIONSHIP_PATTERNS_ARTICLES } from "./relationship-patterns";
import { SELF_SABOTAGE_ARTICLES } from "./self-sabotage";
import { IDENTITY_PURPOSE_ARTICLES } from "./identity-purpose";
import { ASTROLOGY_PSYCHOLOGY_ARTICLES } from "./astrology-psychology";
import { PSYCHOLOGICAL_OBSERVATIONS_ARTICLES } from "./psychological-observations";

export type { Article, ArticleFAQ, ArticleReference } from "../article-types";

export const ALL_ARTICLES: Article[] = [
  ...RELATIONSHIP_PATTERNS_ARTICLES,
  ...SELF_SABOTAGE_ARTICLES,
  ...IDENTITY_PURPOSE_ARTICLES,
  ...ASTROLOGY_PSYCHOLOGY_ARTICLES,
  ...PSYCHOLOGICAL_OBSERVATIONS_ARTICLES,
];

export const ARTICLE_BY_SLUG: Record<string, Article> = Object.fromEntries(
  ALL_ARTICLES.map((a) => [a.slug, a])
);

export function getArticleBySlug(slug: string): Article | null {
  return ARTICLE_BY_SLUG[slug] ?? null;
}

export function getArticlesByCluster(clusterSlug: string): Article[] {
  return ALL_ARTICLES.filter((a) => a.cluster === clusterSlug);
}

export function getRelatedArticles(article: Article, limit = 3): Article[] {
  const related = article.relatedArticles
    .map((slug) => ARTICLE_BY_SLUG[slug])
    .filter((a): a is Article => Boolean(a));
  return related.slice(0, limit);
}

export function getAllArticleSlugs(): string[] {
  return ALL_ARTICLES.map((a) => a.slug);
}
