import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

export const metadata = {
  title: 'Referral API Test',
  description: 'Submit a test referral through Clerk and Supabase.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider dynamic>{children}</ClerkProvider>
      </body>
    </html>
  );
}
