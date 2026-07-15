export interface SupportContact {
  institutionName: string;
  hours: string;
  phone: string;
  email: string;
}

export interface SupportContent {
  headline: string;
  subheadline: string;
  faqPreview: string[];
  contact: SupportContact;
  refundNotice: string;
}
