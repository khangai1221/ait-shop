import { type ReactNode } from 'react';
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/clerk-react';

const KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export function SafeClerkProvider({ children }: { children: ReactNode }) {
  if (!KEY) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider publishableKey={KEY}>
      {children}
    </ClerkProvider>
  );
}

export function SignedInWrapper({ children }: { children: ReactNode }) {
  if (typeof window === "undefined") return null;
  return <SignedIn>{children}</SignedIn>;
}

export function SignedOutWrapper({ children }: { children: ReactNode }) {
  if (typeof window === "undefined") return null;
  return <SignedOut>{children}</SignedOut>;
}

export { SignedIn, SignedOut, UserButton };
