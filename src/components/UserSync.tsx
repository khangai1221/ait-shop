import { useEffect, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { getOrCreateUser } from "@/lib/api/users";

export function UserSync() {
  const { isLoaded, isSignedIn, user } = useUser();
  const syncedFor = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
    if (syncedFor.current === user.id) return;
    syncedFor.current = user.id;
    getOrCreateUser({ data: { displayName: user.fullName ?? undefined } }).catch(() => {
      syncedFor.current = null;
    });
  }, [isLoaded, isSignedIn, user]);

  return null;
}
