// import theme style scss file
import Link from 'next/link';
import 'styles/theme.scss';

export const metadata = {
  title: 'Dashboard SERASI',
  description: 'Dashboard SERASI',
  keywords: 'Dashboard SERASI, banjar, pemerintah',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-light">{children}</body>
    </html>
  );
}
