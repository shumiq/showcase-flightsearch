import { useState } from "react";

const airports = [
  { code: "BKK", city: "Bangkok" },
  { code: "CNX", city: "Chiang Mai" },
  { code: "HKT", city: "Phuket" },
  { code: "USM", city: "Koh Samui" },
  { code: "HDY", city: "Hat Yai" },
  { code: "NRT", city: "Tokyo Narita" },
  { code: "HND", city: "Tokyo Haneda" },
  { code: "KIX", city: "Osaka" },
  { code: "SIN", city: "Singapore" },
  { code: "ICN", city: "Seoul" },
];

interface FlightSearchProps {
  onSearch?: (data: { from: string; to: string; date: string }) => void;
}

function PlaneIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12h5l3-9 4 18 3-9h5" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function SelectField({
  id,
  label,
  value,
  onChange,
  placeholder,
  icon,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </div>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-4 pl-12 pr-10 text-sm font-medium text-gray-900 shadow-sm transition-all hover:border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {airports.map((airport) => (
          <option key={airport.code} value={airport.code}>
            {airport.city} ({airport.code})
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <label htmlFor="date" className="sr-only">
        {label}
      </label>
      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        <CalendarIcon />
      </div>
      <input
        id="date"
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={new Date().toISOString().split("T")[0]}
        className="w-full rounded-xl border border-gray-200 bg-white py-4 pl-12 pr-4 text-sm font-medium text-gray-900 shadow-sm transition-all hover:border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      />
    </div>
  );
}

function SearchButton({
  disabled,
  onClick,
}: {
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-indigo-700 hover:to-violet-700 hover:shadow-xl hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none"
    >
      <PlaneIcon />
      <span>Search Flights</span>
    </button>
  );
}

export function FlightSearch({ onSearch }: FlightSearchProps) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = () => {
    onSearch?.({ from, to, date });
    setIsOpen(false);
  };

  const isValid = from && to && date;

  return (
    <>
      {/* Desktop: Single row layout */}
      <div className="hidden w-full max-w-5xl lg:block">
        <div className="rounded-2xl border border-gray-200/80 bg-white p-3 shadow-xl shadow-gray-900/5">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <SelectField
                id="from-desktop"
                label="From"
                value={from}
                onChange={setFrom}
                placeholder="Select departure"
                icon={<LocationIcon />}
              />
            </div>
            <div className="flex-1">
              <SelectField
                id="to-desktop"
                label="To"
                value={to}
                onChange={setTo}
                placeholder="Select arrival"
                icon={<LocationIcon />}
              />
            </div>
            <div className="flex-1">
              <DateField label="Departure Date" value={date} onChange={setDate} />
            </div>
            <div className="min-w-[200px]">
              <SearchButton disabled={!isValid} onClick={handleSearch} />
            </div>
          </div>
        </div>
      </div>

      {/* Tablet: Single column layout */}
      <div className="hidden w-full max-w-md lg:hidden md:block">
        <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-xl shadow-gray-900/5">
          <div className="flex flex-col gap-3">
            <SelectField
              id="from-tablet"
              label="From"
              value={from}
              onChange={setFrom}
              placeholder="Select departure"
              icon={<LocationIcon />}
            />
            <SelectField
              id="to-tablet"
              label="To"
              value={to}
              onChange={setTo}
              placeholder="Select arrival"
              icon={<LocationIcon />}
            />
            <DateField label="Departure Date" value={date} onChange={setDate} />
            <SearchButton disabled={!isValid} onClick={handleSearch} />
          </div>
        </div>
      </div>

      {/* Mobile: Bottom bar trigger */}
      <div className="fixed inset-x-0 bottom-0 z-40 md:hidden">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex w-full items-center justify-between bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4 text-white shadow-lg"
        >
          <span className="font-semibold">Search Flights</span>
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Mobile: Full-screen modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[90vh] flex-col rounded-t-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Search Flights
              </h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
              <SelectField
                id="from-mobile"
                label="From"
                value={from}
                onChange={setFrom}
                placeholder="Select departure"
                icon={<LocationIcon />}
              />
              <SelectField
                id="to-mobile"
                label="To"
                value={to}
                onChange={setTo}
                placeholder="Select arrival"
                icon={<LocationIcon />}
              />
              <DateField label="Departure Date" value={date} onChange={setDate} />
              <div className="mt-auto pt-4">
                <SearchButton
                  disabled={!isValid}
                  onClick={handleSearch}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
