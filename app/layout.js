export const metadata = {
  title: 'Micro-SaaS Space',
  description: 'A universal AI-driven platform empowering non-technical founders to build, launch, and automate their micro-SaaS products effortlessly.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
