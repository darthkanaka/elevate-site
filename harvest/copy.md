# Old site copy, verbatim

Every word from elevatemediahi.com as it stood on 2026-09-16, captured before the rebuild. Nothing here is edited. Known bugs are flagged in bold beneath the line they appear on, so the rebuild fixes them deliberately instead of copying them forward.

Source: Squarespace 7.1, site ID `62cdf8a27898e2439f8cd217`, template `5c5a519771c10ba3470d8101`, internal domain `papaya-pug-8l8x.squarespace.com`, timezone Pacific/Honolulu. Saved HTML for every page is in `pages/`.

## Site map

Five URLs in the sitemap. Three are real pages, two are orphans with no nav link. `/about`, `/services`, `/portfolio`, `/work`, `/blog`, `/shop` and `/pricing` all return 404.

| URL | In nav | What it is | Last modified |
| --- | --- | --- | --- |
| `/home` (served at `/`) | Home | The marketing homepage | 2025-08-11 |
| `/contact` | Contact, plus the header button | Portrait and a contact form | 2025-08-11 |
| `/terms` | Terms | Privacy policy and SMS terms of service | 2026-02-23 |
| `/murakami-roofing-proposal` | no | Evolve HI client proposal, not Elevate work | 2025-10-02 |
| `/image-host` | no | One hosted drone photo, no copy | 2026-07-28 |

## Global chrome (every page)

Navigation, left to right: logo linking to `/`, then Home to `/`, Contact to `/contact`, Terms to `/terms`, then a bordered button reading CONTACT linking to `/contact`. The header is transparent over the hero and scrolls away rather than sticking.

Footer, one centered line of plain text:

```
(808) 232-6959 | kawika@eleveatemediahi.com
```

**Bug: the email is misspelled.** It reads `eleveatemediahi.com` with an extra "e". The correct address is `kawika@elevatemediahi.com`, confirmed in the Elevate Media Invoices repo. **Bug: neither the phone nor the email is a link.** Both are plain text. The rebuild makes them `tel:` and `mailto:`.

## Homepage

Title tag: `Elevate Media`. Meta description: empty. Open Graph image is the logo.

### Section 1: hero

Black background, full bleed, content centered, with the Squarespace-hosted video `Elevate Banner Video.mov` playing behind it. 38.9 seconds, h264, 16:9.

> H1: QUALITY CONTENT WITHIN YOUR REACH
>
> H4: STRATEGIC MARKETING THROUGH VIDEO, PHOTO, AND MOTION GRAPHICS
>
> Button: CONTACT, links to /contact

### Section 2: services

White background, three across.

> Section title: HIGH QUALITY CONTENT AND MOTION GRAPHICS WITHOUTAD AGENCY RATES.

**Bug: `WITHOUTAD` is missing a space.** It should read WITHOUT AD AGENCY RATES.

> **Video Content**
>
> Videos make up 82% of all web traffic. Elevate Media specializes in combining visuals and storytelling into content that cuts through the noise.

> **Motion Graphics**
>
> Motion graphics usually require massive budgets. Not anymore. Explainer videos, logo animation, and visual effects are all within reach.

> **Photography**
>
> Photos tell stories, record history, and evoke emotion. Don't settle for stock imagery. Let's create purposeful photos to elevate your brand.

Note: the two apostrophes in the Photography paragraph are curly quotes in the source.

> Section button: CONTACT, links to /contact

### Section 3: about and credibility

Dark background (#282828), image and text pairs.

Image caption: `Kawika Lopez | Elevate Media Owner`

> **Small Business Mentality**
>
> Elevate Media is built on relationships and trust. You'll get the care, attention, and thoughtfulness you deserve for your marketing goals. As creatives, our biggest reward is when we see our clients succeed.

Image caption: `Partnering with HiSessions, Four Seasons and musical artist, Fia`

> **Experience and Care**
>
> For the last 10 years we have gained experience in providing business with some of the highest quality content in Hawaii. From local musicians, to major automobile manufacturers, companies like yours have associate themselves with phenomenal marketing tools that elevates their brand to new levels of credibility.

**Bug: three grammar errors in that paragraph.** "providing business with" should be "providing businesses with". "have associate themselves" should be "have associated themselves". "tools that elevates" should be "tools that elevate". Also worth noting: it says ten years, and it was written in 2022, so the number is now stale.

> Button: VIEW PORTFOLIO, links to https://kawikalopez.com/portfolio

That link is external and still returns 200. The portfolio has never lived on this site.

### Section 4: process

White background, three across.

> Section title: ELEVATE YOUR BRAND NOW

> **STEP 1**: FORGET ABOUT HOW MUCH YOU THINK IT WILL COST
>
> **STEP 2**: CONTACT ME FOR A FREE DISCOVERY MEETING
>
> **STEP 3**: ELEVATE YOUR BRAND TO THE NEXT LEVEL

> Section button: CONTACT, links to /contact

### Section 5: client logo wall

Dark background, twelve logos in a grid, no alt text on any of them. In order: Hawaiian Airlines, Four Seasons, Jeep, Motorola, Hawaii Tourism Authority, DTRIC Insurance, Koolau Ballrooms, Kamehameha Schools, Kualoa Ranch, Locations, Town and Country, Tiffen.

### Section 6: footer

The global footer line.

## Contact page

Title tag: `Contact 3 — Elevate Media`.

**Bug: the title still says "Contact 3".** Leftover from duplicating a Squarespace template section.

> H2: Get in touch

A circular-cropped self portrait sits beside the form. Below it, the form.

| Field | Type | Required |
| --- | --- | --- |
| Name | first and last | yes |
| Email | email | yes |
| Subject | text | yes |
| Message | textarea | yes |

Submit button reads `Submit`. Success message reads `Thank you!` with no redirect. reCAPTCHA Enterprise is on. The SMS consent option is switched on but the business name, privacy policy URL and terms URL are all empty, so that feature is half configured. On rebuild those links point at the terms page.

## Terms page

Title tag: `Terms — Elevate Media`.

> H4: Privacy Policy & Terms of Service

**Bug: the entire body is pasted into code blocks.** Every line is its own `<pre><code>` element, so a legal document renders as monospace code. The rebuild marks it up as real headings, paragraphs and lists.

The full text follows. Horizontal rules in the source are shown as `---`.

```
Effective Date: January 1, 2026

This page describes how Elevate Media LLC ("Elevate Media," "we," "us," or "our") collects, uses, and protects your information, and outlines the terms governing our SMS notification service.

---

PRIVACY POLICY

Information We Collect

When you work with Elevate Media as a contractor or team member, we may collect the following information:
    • Your name
    • Your mobile phone number
    • Your email address
    • Records of your consent to receive SMS messages

How We Use Your Information

We use your information for the following purposes:
    • To send SMS notifications related to scheduling, calendar reminders, task assignments, and business operations
    • To communicate with you about projects and work assignments
    • To respond to your questions, requests, or support inquiries
    • To maintain records of consent and opt-out preferences as required by law

Information Sharing

We do not sell, rent, trade, or share your personal information with third parties for their marketing purposes. We may share information only in the following circumstances:
    • With service providers who help us deliver SMS notifications (such as our messaging platform provider)
    • When required by law or to protect our legal rights

Data Retention

We retain your personal information only as long as necessary to provide our services or as required by applicable law. If you opt out of SMS notifications, we will stop sending you messages but will retain a record of your opt-out preference to honor your request.

Data Security

We implement reasonable administrative, technical, and physical safeguards to protect your information from unauthorized access, use, or disclosure. However, no data transmission or storage system is guaranteed to be 100% secure.

Your Rights

You may request access to, correction of, or deletion of your personal information by contacting us through our contact page. We will respond to your request within a reasonable timeframe.

---

SMS TERMS OF SERVICE

Service Description

Elevate Media provides SMS notifications to contractors and team members for business operations, including:
    • Calendar reminders
    • Task notifications
    • Scheduling updates
    • Call summaries

This service is intended for internal business use only.

Consent and Opt-In

By replying YES to an opt-in request from Elevate Media, you expressly consent to receive SMS messages from us at the mobile number you provided. You confirm that:
    • You are the owner or authorized user of the mobile device associated with that number
    • Consent is not a condition of employment or working with Elevate Media

At the time of opt-in, you will receive a message confirming your enrollment. Example:
    "Elevate Media: As a contractor working with our company, we'd like to send you text messages for calendar reminders, task notifications, and call summaries. Msg frequency varies. Msg & data rates may apply. Reply YES to opt in or NO to decline. STOP to opt out, HELP for help."

Message Frequency

Message frequency varies depending on:
    • Your scheduled work
    • Assigned tasks
    • Business activity

You may receive multiple messages per day or only occasional messages depending on operational needs.

Message and Data Rates

Standard message and data rates from your mobile carrier may apply to messages you send and receive. Elevate Media is not responsible for any fees charged by your carrier.

Opting Out

You may opt out of SMS notifications at any time:
    • Reply STOP to any message you receive from us
    • You will receive a single confirmation message
    • You will not receive further SMS notifications unless you opt in again
    • Opting out will not affect your working relationship with Elevate Media

Help and Support

For assistance with SMS notifications:
    • Reply HELP to any message
    • Contact us through our contact page at elevatemediahi.com/contact

Supported Carriers

SMS notifications are supported on most major U.S. carriers. Carriers are not liable for delayed or undelivered messages.

No Warranties

SMS notifications are provided as a convenience and on an "as is" basis. We do not warrant that messages will be delivered without delay, error, or interruption. You should not rely solely on SMS notifications for critical schedule or task information.

Limitation of Liability

To the fullest extent permitted by law, Elevate Media shall not be liable for any damages arising from the use of or inability to use the SMS notification service, including but not limited to:
    • Missed or delayed messages
    • Carrier outages
    • Device incompatibility

Modifications to Service

We reserve the right to modify, suspend, or discontinue the SMS notification service at any time without prior notice.

---

GENERAL TERMS

Changes to This Policy

We may update this Privacy Policy and Terms of Service from time to time. If we make material changes, we will notify you by posting the updated policy on this page with a new effective date. Your continued use of our services after changes are posted constitutes your acceptance of the revised terms.

Governing Law

This policy and these terms are governed by the laws of the State of Hawaii, without regard to conflict of law principles.

Contact Us

If you have questions about this Privacy Policy, Terms of Service, or our SMS notification practices, please contact us through our contact page at elevatemediahi.com/contact.

---

Elevate Media LLC
Honolulu, Hawaii
```

Note the entity name used throughout is "Elevate Media LLC". Per the vault business record, Elevate Media is a trade name under Veex Photo LLC, not its own LLC. Worth a check with Kawika before this text carries over.

Address of record is Honolulu, Hawaii. No street address appears anywhere on the site.

## Orphan pages

`/image-host` has the title `Image Hosting — Elevate Media` and contains a single full-bleed drone photo with no header, footer, nav or copy. It exists to hot-link one image. Decide keep or delete before Squarespace is cancelled.

`/murakami-roofing-proposal` is a custom-coded proposal page for an Evolve HI product, an AI phone receptionist. Different branding entirely, navy and coral on cream, with a phone CTA at (808) 201-4040. It is another company's collateral sitting on the Elevate domain. It is deliberately not harvested into this repo. Move it to Evolve HI or delete it before cancelling Squarespace. The saved HTML is in `pages/` only so nothing is lost.

## What the old site does not have

No portfolio, no case studies, no playable reel, for an agency that sells video. No analytics of any kind, no pixel, no tag manager. No social links and no connected social accounts. No booking or scheduling tool. No newsletter. Twenty one of the twenty two images have empty alt text. The Squarespace default robots.txt blocks AI crawlers.
