import { useState, useEffect } from "react";

function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState("unknown");

  const checkSize = () => {
    if (window.innerWidth >= 1024) {
      setBreakpoint("desktop"); // ≥1024px
    } else {
      setBreakpoint("mobile"); // ≥768px
    }
  };

  useEffect(() => {
    // چک اولیه
    checkSize();

    // وقتی تغییر اندازه رخ بده
    window.addEventListener("resize", checkSize);

    // پاکسازی
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  return breakpoint;
}

export default useBreakpoint;
