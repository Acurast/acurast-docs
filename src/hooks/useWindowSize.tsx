import { useState, useEffect } from "react";

// Browser only: callers must render inside <BrowserOnly>.
function useWindowSize() {
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