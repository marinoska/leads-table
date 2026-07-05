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
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
