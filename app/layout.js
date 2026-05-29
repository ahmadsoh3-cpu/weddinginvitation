import './globals.css';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next"
export const metadata = {
  metadataBase: new URL('https://hannanwedsjiya.vercel.app'),
  title: 'Hannan & Jayesha — Nikkah Invitation',
  description:
    'You are cordially invited to the Nikkah of Hannan Ahmed & Jayesha Farooqi on 8th June 2026 at Bahria Golf & Country Club.',
  keywords: ['wedding invitation', 'nikkah', 'Hannan Ahmed', 'Jayesha Farooqi', 'wedding 2026'],
  authors: [{ name: 'Hannan & Jayesha' }],
  openGraph: {
    title: 'Hannan Ahmed & Jayesha Farooqi — Nikkah Invitation',
    description: 'Join us for our Nikkah on 8th June 2026 at Bahria Golf & Country Club. Your presence would make our special day complete.',
    url: 'https://hannanwedsjiya.vercel.app',
    type: 'website',
    locale: 'en_US',
    siteName: 'Hannan & Jayesha Wedding',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Hannan Ahmed & Jayesha Farooqi — Nikkah Invitation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hannan & Jayesha — Nikkah Invitation',
    description: 'You are cordially invited to our Nikkah ceremony',
    images: ['/og-image.png'],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Hannan Ahmed & Jayesha Farooqi — Nikkah Ceremony',
    description: 'Join us for the Nikkah ceremony of Hannan Ahmed and Jayesha Farooqi',
    startDate: '2026-06-08T18:00:00+05:00',
    endDate: '2026-06-08T22:00:00+05:00',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: 'Bahria Golf & Country Club',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'PK',
      },
    },
    organizer: {
      '@type': 'Person',
      name: 'Hannan Ahmed & Jayesha Farooqi',
    },
    image: '/wedding-floral.png',
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Great+Vibes&family=Pinyon+Script&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <meta property="og:url" content="https://hannanwedsjiya.vercel.app" />
        <meta property="fb:app_id" content="966242223397117" />
        <meta name="theme-color" content="#FFFCF7" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body>{children}<SpeedInsights /></body>
    </html>
  );
}
