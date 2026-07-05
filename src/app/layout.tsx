import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'Leads Table',
  description: 'Paginated leads dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // suppressHydrationWarning: browser extensions (e.g. Tag Assistant) inject
    // attributes on <html> before hydration; this ignores that attribute-only
    // mismatch on <html> without affecting the rest of the tree.
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
