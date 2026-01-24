import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";

const apiAny = api as any;

export function usePlanExpiration() {
  const expirationCheck = useQuery(apiAny.planAccess.shouldShowExpirationPopup);
  const [hasShownPopup, setHasShownPopup] = useState(false);

  const shouldShow = expirationCheck?.shouldShow && !hasShownPopup;

  useEffect(() => {
    if (shouldShow) {
      // Prevent showing multiple times in the same session
      setHasShownPopup(true);
    }
  }, [shouldShow]);

  return {
    shouldShowPopup: shouldShow,
    tier: expirationCheck?.tier as "single_debug_fix" | "single_scan" | "interview_sprint",
    reason: expirationCheck?.reason as "expired" | "exhausted",
  };
}
