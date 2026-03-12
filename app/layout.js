import './globals.css';
import { Space_Grotesk, Sora } from 'next/font/google';

const space = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });
const sora = Sora({ subsets: ['latin'], variable: '--font-sora' });

export const metadata = {
  title: 'Calendly Clone',
  description: 'Scheduling platform demo'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${space.variable} ${sora.variable}`}>
      <body>
        <div className="app-shell">
          {children}
        </div>
      </body>
    </html>
  );
}
