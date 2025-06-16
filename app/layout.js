// import theme style scss file
import Link from 'next/link';
import 'styles/theme.scss';

export const metadata = {
  title: 'Dashboard SIA',
  description: 'Dashboard SIA',
  keywords: 'Dashboard SIA, banjar, pemerintah',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-light">{children}</body>
    </html>
  );
}
