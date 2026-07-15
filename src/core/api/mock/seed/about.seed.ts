import type { AboutContentDTO } from '@/features/about/types';

export const aboutContentSeed: AboutContentDTO = {
  eyebrow: 'About CorpersLink',
  headline: 'Getting every corps member to camp — safely, fairly, on time.',
  body: 'CorpersLink was born out of a familiar scene: hundreds of newly mobilised corps members scrambling for overpriced, unverified transport on the morning of camp resumption. We partner directly with institutions and vetted transporters so that every seat is published, priced and paid for transparently — before travel day.',
  values: [
    {
      icon_key: 'verified',
      title: 'Verified, end to end',
      description:
        'Every transporter is vetted and every vehicle is registered with your institution before it appears on CorpersLink.',
    },
    {
      icon_key: 'fair-fares',
      title: 'Fair, published fares',
      description:
        'No camp-morning price surges. The fare you see is the fare you pay — receipts prove it.',
    },
    {
      icon_key: 'community',
      title: 'Built for corps members',
      description:
        'Designed with serving corps members across 37 camps — from seat maps to offline receipts.',
    },
  ],
  stats: [
    { id: 'founded', label: 'Founded in Lagos', value: '2024' },
    { id: 'institutions', label: 'Partner institutions', value: '64' },
    { id: 'transporters', label: 'Verified transporters', value: '180+' },
    { id: 'camps', label: 'Camps served nationwide', value: '37' },
  ],
};
