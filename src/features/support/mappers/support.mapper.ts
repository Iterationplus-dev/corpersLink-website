import type {
  SupportContact,
  SupportContactDTO,
  SupportContent,
  SupportContentDTO,
} from '@/features/support/types';

export function mapSupportContact(dto: SupportContactDTO): SupportContact {
  return {
    institutionName: dto.institution_name,
    hours: dto.hours,
    phone: dto.phone,
    email: dto.email,
  };
}

export function mapSupportContent(dto: SupportContentDTO): SupportContent {
  return {
    headline: dto.headline,
    subheadline: dto.subheadline,
    faqPreview: dto.faq_preview,
    contact: mapSupportContact(dto.contact),
    refundNotice: dto.refund_notice,
  };
}
