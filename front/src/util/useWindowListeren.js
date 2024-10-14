import { useEffect } from "react";

export function useWindowListeren(eventType, listeren) {
  useEffect(() => {
    window.addEventListener(eventType, listeren);
    return () => {
      window.removeEventListener(eventType, listeren);
    };
  }, [eventType, listeren]);
}