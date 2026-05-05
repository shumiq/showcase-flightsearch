import { useState, useRef, useEffect, useMemo } from "react";

export interface Airport {
  code: string;
  city: string;
}

interface AirportSelectorProps {
  id: string;
  label: string;
  value: string;
  onChange: (code: string) => void;
  placeholder: string;
  airports: Airport[];
  icon: React.ReactNode;
}

function ChevronDownIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function ChevronUpIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M18 15l-6-6-6 6" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

export function AirportSelector({
  id,
  label,
  value,
  onChange,
  placeholder,
  airports,
  icon,
}: AirportSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selectedAirport = airports.find((a) => a.code === value);

  const filtered = useMemo(() => {
    if (!search) return airports;
    const q = search.toLowerCase();
    return airports.filter(
      (a) =>
        a.city.toLowerCase().includes(q) ||
        a.code.toLowerCase().includes(q)
    );
  }, [airports, search]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (code: string) => {
    onChange(code);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div ref={containerRef} className="relative">
      <label htmlFor={id} className="sr-only">{label}</label>
      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </div>
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded-xl border border-gray-200 bg-white py-4 pl-12 pr-10 text-left text-sm font-medium shadow-sm transition-all hover:border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={selectedAirport ? "text-gray-900" : "text-gray-400"}>
          {selectedAirport
            ? `${selectedAirport.city} (${selectedAirport.code})`
            : placeholder}
        </span>
      </button>
      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
        {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-gray-200 bg-white py-2 shadow-xl shadow-gray-900/10">
          <div className="border-b border-gray-100 px-3 py-2">
            <div className="relative">
              <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <SearchIcon />
              </div>
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search airport..."
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/20"
              />
            </div>
          </div>
          <ul role="listbox" className="max-h-52 overflow-y-auto">
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-gray-400">No airports found</li>
            ) : (
              filtered.map((airport) => (
                <li
                  key={airport.code}
                  role="option"
                  aria-selected={airport.code === value}
                  onClick={() => handleSelect(airport.code)}
                  className={`cursor-pointer px-4 py-3 text-sm transition-colors hover:bg-indigo-50 ${
                    airport.code === value
                      ? "bg-indigo-50 font-semibold text-indigo-700"
                      : "text-gray-700"
                  }`}
                >
                  {airport.city} <span className="text-gray-400">({airport.code})</span>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
