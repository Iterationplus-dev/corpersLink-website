export interface SupportContactDTO {
  institution_name: string;
  hours: string;
  phone: string;
  email: string;
}

export interface SupportContentDTO {
  headline: string;
  subheadline: string;
  faq_preview: string[];
  contact: SupportContactDTO;
  refund_notice: string;
}
