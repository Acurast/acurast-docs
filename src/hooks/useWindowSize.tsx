import { useState, useEffect } from "react";

function useWindowSize() {
  if (typeof window === "undefined") {
    return {
      width: 999,
      height: 999,
    };
  }

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handler() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return windowSize;
}

export default useWindowSize;