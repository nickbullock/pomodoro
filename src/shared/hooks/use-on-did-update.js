import { useRef, useEffect } from "react";

export function useOnDidUpdate(
  callback,
  deps
) {
  const mountedRef = useRef(false);

  useEffect(() => {
      if (!mountedRef.current) {
          mountedRef.current = true;
      } else {
          callback();
      }
  }, deps)

  return mountedRef.current;
}