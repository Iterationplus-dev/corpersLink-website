export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqContent {
  headline: string;
  subheadline: string;
  items: FaqItem[];
}
