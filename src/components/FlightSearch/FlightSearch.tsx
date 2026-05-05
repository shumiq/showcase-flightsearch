import { useState } from "react";
import { AirportSelector } from "./AirportSelector";
import { DatesSelector, type DateRange } from "./DatesSelector";

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
  onSearch?: (data: { from: string; to: string; date: DateRange }) => void;
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
  const [dateRange, setDateRange] = useState<DateRange>({ departure: '' });
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = () => {
    onSearch?.({ from, to, date: dateRange });
    setIsOpen(false);
  };

  const isValid = from && to && dateRange.departure;

  return (
    <>
      {/* Desktop: Single row layout */}
      <div className="hidden w-full max-w-5xl lg:block">
        <div className="rounded-2xl border border-gray-200/80 bg-white p-3 shadow-xl shadow-gray-900/5">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <AirportSelector
                id="from-desktop"
                label="From"
                value={from}
                onChange={setFrom}
                placeholder="Select departure"
                airports={airports}
                icon={<LocationIcon />}
              />
            </div>
            <div className="flex-1">
              <AirportSelector
                id="to-desktop"
                label="To"
                value={to}
                onChange={setTo}
                placeholder="Select arrival"
                airports={airports}
                icon={<LocationIcon />}
              />
            </div>
            <div className="flex-1">
              <DatesSelector id="date-desktop" label="Departure Date" value={dateRange} onChange={setDateRange} />
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
            <AirportSelector
              id="from-tablet"
              label="From"
              value={from}
              onChange={setFrom}
              placeholder="Select departure"
              airports={airports}
              icon={<LocationIcon />}
            />
            <AirportSelector
              id="to-tablet"
              label="To"
              value={to}
              onChange={setTo}
              placeholder="Select arrival"
              airports={airports}
              icon={<LocationIcon />}
            />
            <DatesSelector id="date-tablet" label="Departure Date" value={dateRange} onChange={setDateRange} />
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
              <AirportSelector
                id="from-mobile"
                label="From"
                value={from}
                onChange={setFrom}
                placeholder="Select departure"
                airports={airports}
                icon={<LocationIcon />}
              />
              <AirportSelector
                id="to-mobile"
                label="To"
                value={to}
                onChange={setTo}
                placeholder="Select arrival"
                airports={airports}
                icon={<LocationIcon />}
              />
              <DatesSelector id="date-mobile" label="Departure Date" value={dateRange} onChange={setDateRange} />
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
