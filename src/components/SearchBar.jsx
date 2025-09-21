// SearchBar.jsx
// Reusable Search Bar component that *looks like* shadcn UI but **does NOT** depend on shadcn library.
// Completely implemented with plain React + Tailwind CSS + lucide-react icons.
// Props:
// - placeholder: string
// - onSearch: function(value) => void  (called when user presses Enter or immediate search button)
// - debounceMs: number (default 300)
// - className: additional classes for container
// - showClear: boolean (default true)
// - suggestions: optional array of strings to show a simple suggestion list

import React, { useEffect, useRef, useState } from "react";
import { X, Search } from "lucide-react";

export default function SearchBar({
  placeholder = "جستجو...",
  onSearch = () => {},
  debounceMs = 300,
  className = "",
  showClear = true,
  suggestions = [],
}) {
  const [value, setValue] = useState("");
  const [debounced, setDebounced] = useState(value);
  const [openSuggestions, setOpenSuggestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef(null);

  // debounce effect for calling onSearch (automatic)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), debounceMs);
    return () => clearTimeout(id);
  }, [value, debounceMs]);

  useEffect(() => {
    onSearch(debounced);
  }, [debounced]);

  // click outside handler to close suggestions
  useEffect(() => {
    function onDoc(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpenSuggestions(false);
        setHighlightIndex(-1);
      }
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const filtered =
    suggestions && value
      ? suggestions
          .filter((s) => s.toLowerCase().includes(value.toLowerCase()))
          .slice(0, 6)
      : [];

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearch(value);
      setOpenSuggestions(false);
      setHighlightIndex(-1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpenSuggestions(true);
      setHighlightIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Escape") {
      setOpenSuggestions(false);
      setHighlightIndex(-1);
    }
  }

  useEffect(() => {
    if (highlightIndex >= 0 && highlightIndex < filtered.length) {
      // if user highlights, update the input value preview (but don't commit search)
      setValue(filtered[highlightIndex]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightIndex]);

  function handleClear() {
    setValue("");
    onSearch("");
    setOpenSuggestions(false);
    setHighlightIndex(-1);
  }

  function handleSuggestionClick(s) {
    setValue(s);
    onSearch(s);
    setOpenSuggestions(false);
    setHighlightIndex(-1);
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <input
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setOpenSuggestions(true);
              setHighlightIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            aria-label="search"
            className={`w-full rounded-4xl border border-slate-200 bg-white px-4 py-2 pr-12 text-sm  placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-800/60 focus:border-primary`}
          />

          <div className="absolute inset-y-0 right-3 flex items-center gap-2">
            {showClear && value && (
              <button
                onClick={handleClear}
                aria-label="clear search"
                className="p-1 rounded-md hover:bg-slate-100"
                type="button"
              >
                <X size={16} />
              </button>
            )}

            <div className="p-1 rounded-md">
              <Search size={18} />
            </div>
          </div>
        </div>
      </div>

      {openSuggestions && filtered.length > 0 && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-lg border bg-white shadow-lg">
          <ul className="max-h-56 overflow-auto">
            {filtered.map((s, idx) => (
              <li
                key={s + idx}
                onMouseDown={(e) => e.preventDefault()} // prevent blur before click
                onClick={() => handleSuggestionClick(s)}
                className={`cursor-pointer px-4 py-2 text-sm ${
                  idx === highlightIndex ? "bg-slate-100" : "hover:bg-slate-50"
                }`}
              >
                {/* highlight matched part */}
                {(() => {
                  const low = s.toLowerCase();
                  const q = value.toLowerCase();
                  const start = low.indexOf(q);
                  if (start === -1 || q === "") return s;
                  const end = start + q.length;
                  return (
                    <span>
                      {s.slice(0, start)}
                      <span className="font-semibold underline decoration-primary/40">
                        {s.slice(start, end)}
                      </span>
                      {s.slice(end)}
                    </span>
                  );
                })()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/*
Usage:

import SearchBar from "./SearchBar";

function Page() {
  function handleSearch(q) {
    console.log("search: ", q);
  }

  return (
    <SearchBar
      placeholder="جستجوی محصولات..."
      onSearch={handleSearch}
      debounceMs={400}
      suggestions={["کتاب", "کفش", "گوشی", "هدفون"]}
    />
  );
}

Notes:
- This component intentionally uses plain HTML inputs and Tailwind classes so it can be used without any UI library.
- `primary` utility color should exist in your Tailwind config (or replace `bg-primary` with `bg-blue-600`, etc.).
- If you want keyboard navigation to *not* replace the input while navigating, we can change that behavior to a preview-only highlight.
- Want TypeScript or an accessible ARIA-compliant combobox behavior? I can provide that next.
*/
