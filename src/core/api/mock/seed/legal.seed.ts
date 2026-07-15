import type { LegalContentDTO } from '@/features/legal/types';

export const privacyContentSeed: LegalContentDTO = {
  headline: 'Privacy Policy',
  subheadline:
    'Effective 1 July 2026 · Compliant with the Nigeria Data Protection Regulation (NDPR)',
  sections: [
    {
      heading: '1. What we collect',
      body: "Your name, email, phone number, NYSC call-up number, optional state code, and next-of-kin contact details — only what's needed to book and manifest your trip.",
    },
    {
      heading: '2. How we use it',
      body: 'To verify your institution, reserve your seat, process payment via Paystack, Monnify or Flutterwave, generate receipts, and build the departure manifest. We never sell your data.',
    },
    {
      heading: '3. Who we share with',
      body: "Your institution's transport desk and NYSC camp officials receive manifest data. Payment processors receive only what's needed to complete your transaction — we never store card details.",
    },
    {
      heading: '4. Retention & your rights',
      body: 'Under the NDPR you may access, correct, or delete your data at any time from Profile & settings. Manifest records already generated are retained as required by your institution.',
    },
    {
      heading: '5. Contact',
      body: 'Questions about this policy? Write to privacy@corperslink.ng or your institution’s data protection officer.',
    },
    {
      heading: '6. Independence disclaimer',
      body: 'CorpersLink is an independent transportation platform designed to assist prospective and serving corps members with travel arrangements. It is not affiliated with, endorsed by, sponsored by, or operated by the National Youth Service Corps (NYSC). All NYSC names, trademarks, and related references remain the property of their respective owners.',
    },
  ],
};

export const termsContentSeed: LegalContentDTO = {
  headline: 'Terms & Conditions',
  subheadline: 'Effective 1 July 2026 · Iterationplus Technologies Ltd',
  sections: [
    {
      heading: '1. Eligibility & accounts',
      body: 'CorpersLink is for prospective corps members of participating institutions. You must register with your own details and keep your sign-in credentials confidential.',
    },
    {
      heading: '2. Bookings & seat holds',
      body: 'A selected seat is held for 15 minutes pending payment. One active seat per corps member. Unpaid holds release automatically.',
    },
    {
      heading: '3. Fares, payments & refunds',
      body: 'Fares are published by your institution and are non-refundable once the departure manifest is generated. Failed payments that were debited are auto-reversed by the payment provider.',
    },
    {
      heading: '4. Conduct & liability',
      body: 'Transport is operated by your institution. CorpersLink provides booking, payment and manifest services and is not liable for delays or events during travel.',
    },
    {
      heading: '5. Changes',
      body: 'We may update these terms; material changes are announced in-app at least 7 days before they take effect.',
    },
    {
      heading: '6. Independence disclaimer',
      body: 'CorpersLink is an independent transportation platform designed to assist prospective and serving corps members with travel arrangements. It is not affiliated with, endorsed by, sponsored by, or operated by the National Youth Service Corps (NYSC). All NYSC names, trademarks, and related references remain the property of their respective owners.',
    },
  ],
};
