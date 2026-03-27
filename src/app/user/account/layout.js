// Prevent prerendering for account routes that use context hooks
export const dynamic = 'force-dynamic';

export default function AccountLayout({ children }) {
  return children;
}
