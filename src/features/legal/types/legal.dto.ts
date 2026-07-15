export interface LegalSectionDTO {
  heading: string;
  body: string;
}

export interface LegalContentDTO {
  headline: string;
  subheadline: string;
  sections: LegalSectionDTO[];
}
