import './globals.css';

export const metadata = {
  title: 'Hannan & Jiya — Nikkah Invitation',
  description:
    'You are cordially invited to the Nikkah of Hannan Ahmad & Jiya Farooqi on 5th June 2026.',
  openGraph: {
    title: 'Hannan Ahmad & Jiya Farooqi — Nikkah',
    description: 'Join us for our Nikkah on 5th June 2026',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Great+Vibes&family=Jost:wght@200;300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
