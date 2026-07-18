export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

/** `headline`/`subheadline` are static page chrome, not part of the real
 * backend's FAQ contract (`GET support/faqs/` returns just the items array)
 * — see `buildFaqContent` in the mapper. */
export interface FaqContent {
  headline: string;
  subheadline: string;
  items: FaqItem[];
}
