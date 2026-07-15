export interface LegalSection {
  heading: string;
  body: string;
}

export interface LegalContent {
  headline: string;
  subheadline: string;
  sections: LegalSection[];
}
