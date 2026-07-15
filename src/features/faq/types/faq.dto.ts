export interface FaqItemDTO {
  question: string;
  answer: string;
}

export interface FaqContentDTO {
  headline: string;
  subheadline: string;
  items: FaqItemDTO[];
}
