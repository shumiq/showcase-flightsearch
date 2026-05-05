import { useState, useRef, useEffect } from "react";

export type TripType = 'oneWay' | 'return';

export interface DateRange {
  departure: string;
  return?: string;
}

interface DatesSelectorProps {
  id: string;
  label: string;
  value: DateRange;
  onChange: (dateRange: DateRange) => void;
  defaultTripType?: TripType;
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

function ChevronLeftIcon() {
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
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
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
      <path d="M9 18l6-6-6-6" />
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

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function parseDate(dateStr: string) {
  if (!dateStr) return { year: new Date().getFullYear(), month: new Date().getMonth(), day: new Date().getDate() };
  const [year, month, day] = dateStr.split("-").map(Number);
  return { year, month: month - 1, day };
}

function isToday(year: number, month: number, day: number) {
  const today = new Date();
  return (
    today.getFullYear() === year &&
    today.getMonth() === month &&
    today.getDate() === day
  );
}

function isPastDate(year: number, month: number, day: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compare = new Date(year, month, day);
  return compare < today;
}

export function DatesSelector({ id, label, value, onChange, defaultTripType = 'return' }: DatesSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tripType, setTripType] = useState<TripType>(defaultTripType);
  const [departureDate, setDepartureDate] = useState<string>('');
  const [returnDate, setReturnDate] = useState<string>('');
  const [selectingReturn, setSelectingReturn] = useState(false);

  const [viewYear, setViewYear] = useState(() => {
    if (value) {
      const parsed = parseDate(value.departure || '');
      return parsed.year;
    }
    return new Date().getFullYear();
  });
  const [viewMonth, setViewMonth] = useState(() => {
    if (value) {
      const parsed = parseDate(value.departure || '');
      return parsed.month;
    }
    return new Date().getMonth();
  });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Initialize dates from value prop
  useEffect(() => {
    if (value && value.departure !== departureDate) {
      setDepartureDate(value.departure || '');
    }
    if (value && value.return !== returnDate) {
      setReturnDate(value.return || '');
    }
  }, [value?.departure, value?.return]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSelectDate = (day: number) => {
    const selectedDateStr = formatDate(viewYear, viewMonth, day);

    if (tripType === 'oneWay') {
      setDepartureDate(selectedDateStr);
      setReturnDate('');
      onChange({ departure: selectedDateStr });
      setIsOpen(false);
    } else {
      if (!departureDate || selectingReturn) {
        if (!departureDate) {
          setDepartureDate(selectedDateStr);
          setSelectingReturn(true);
          // Don't close, let user select return date
        } else {
          // Selecting return date
          if (selectedDateStr >= departureDate) {
            setReturnDate(selectedDateStr);
            onChange({ departure: departureDate, return: selectedDateStr });
            setIsOpen(false);
            setSelectingReturn(false);
          }
        }
      } else {
        // Reset and start over
        setDepartureDate(selectedDateStr);
        setReturnDate('');
        setSelectingReturn(true);
      }
    }
  };

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const isDateInRange = (year: number, month: number, day: number) => {
    if (!departureDate || !returnDate) return false;
    const checkDate = formatDate(year, month, day);
    return checkDate > departureDate && checkDate < returnDate;
  };

  const isRangeStart = (year: number, month: number, day: number) => {
    if (!departureDate) return false;
    const checkDate = formatDate(year, month, day);
    return checkDate === departureDate;
  };

  const isRangeEnd = (year: number, month: number, day: number) => {
    if (!returnDate) return false;
    const checkDate = formatDate(year, month, day);
    return checkDate === returnDate;
  };

  const renderCalendar = (isMobile = false) => {
    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayIsToday = isToday(viewYear, viewMonth, day);
      const dayIsPast = isPastDate(viewYear, viewMonth, day);
      const inRange = isDateInRange(viewYear, viewMonth, day);
      const isStart = isRangeStart(viewYear, viewMonth, day);
      const isEnd = isRangeEnd(viewYear, viewMonth, day);
      const isSelected = isStart || isEnd;

      const getDayClass = () => {
        if (isSelected) return "bg-indigo-600 text-white";
        if (inRange) return "bg-indigo-50 text-indigo-600";
        if (dayIsToday) return "bg-indigo-50 text-indigo-600";
        if (dayIsPast) return "cursor-not-allowed text-gray-300";
        return "text-gray-700 hover:bg-gray-100";
      };

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => handleSelectDate(day)}
          disabled={dayIsPast && !isSelected}
          className={`h-10 w-10 rounded-full text-sm font-medium transition-all ${getDayClass()}`}
        >
          {day}
        </button>
      );
    }

    return (
      <div className={isMobile ? "flex flex-col" : "absolute top-full z-50 mt-2"}>
        <div
          className={`${isMobile ? "" : "w-80"} rounded-xl border border-gray-200 bg-white p-4 shadow-xl`}
        >
          {/* Trip Type Selector */}
          <div className="mb-4 flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`trip-type-${id}-${isMobile ? 'mobile' : 'desktop'}`}
                value="oneWay"
                checked={tripType === 'oneWay'}
                onChange={(e) => {
                  if (e.target.checked) {
                    setTripType('oneWay');
                    setReturnDate('');
                    setSelectingReturn(false);
                  }
                }}
                className="h-4 w-4 cursor-pointer text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-gray-700">One Way</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`trip-type-${id}-${isMobile ? 'mobile' : 'desktop'}`}
                value="return"
                checked={tripType === 'return'}
                onChange={(e) => {
                  if (e.target.checked) {
                    setTripType('return');
                    setSelectingReturn(false);
                  }
                }}
                className="h-4 w-4 cursor-pointer text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-gray-700">Return</span>
            </label>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrevMonth}
              aria-label="Previous month"
              className="rounded-lg p-1.5 text-gray-600 transition-colors hover:bg-gray-100"
            >
              <ChevronLeftIcon />
            </button>
            <div className="text-sm font-semibold text-gray-900">
              {MONTHS[viewMonth]} {viewYear}
            </div>
            <button
              type="button"
              onClick={handleNextMonth}
              aria-label="Next month"
              className="rounded-lg p-1.5 text-gray-600 transition-colors hover:bg-gray-100"
            >
              <ChevronRightIcon />
            </button>
          </div>
          <div className="mb-2 grid grid-cols-7 gap-0">
            {DAYS.map((day) => (
              <div
                key={day}
                className="h-10 w-10 text-center text-xs font-medium text-gray-500 flex items-center justify-center"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0">{days}</div>

          {/* Selection hint */}
          {tripType === 'return' && !returnDate && departureDate && (
            <div className="mt-3 text-center text-xs text-gray-500">
              Now select your return date
            </div>
          )}
        </div>
      </div>
    );
  };

  const displayValue = () => {
    if (!departureDate) return "";
    const dep = new Date(parseDate(departureDate).year, parseDate(departureDate).month, parseDate(departureDate).day);
    const depStr = dep.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    if (tripType === 'oneWay' || !returnDate) {
      return dep.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }

    const ret = new Date(parseDate(returnDate).year, parseDate(returnDate).month, parseDate(returnDate).day);
    return `${depStr} - ${ret.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  };

  const display = displayValue();

  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <button
        ref={triggerRef}
        type="button"
        id={id}
        onClick={() => {
          if (!isOpen && tripType === 'return' && departureDate && !returnDate) {
            setSelectingReturn(true);
          }
          setIsOpen(!isOpen);
        }}
        className="relative w-full rounded-xl border border-gray-200 bg-white py-4 pl-12 pr-4 text-left text-sm font-medium text-gray-900 shadow-sm transition-all hover:border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      >
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <CalendarIcon />
        </div>
        <span className={display ? "text-gray-900" : "text-gray-400"}>
          {display || "Select date"}
        </span>
      </button>

      {/* Calendar dropdown/modal */}
      {isOpen && (
        <div data-testid="calendar-container">
          {/* Desktop dropdown */}
          <div data-testid="desktop-calendar" className="absolute top-full z-50 mt-2 hidden md:block" ref={dropdownRef}>
            {renderCalendar()}
          </div>

          {/* Mobile full-screen modal */}
          <div data-testid="mobile-calendar" className="fixed inset-0 z-50 flex items-end justify-center md:hidden">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <div className="relative z-10 flex max-h-[90vh] w-full flex-col rounded-t-3xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Select Date
                </h2>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                >
                  <CloseIcon />
                </button>
              </div>
              <div className="flex flex-1 flex-col items-center overflow-y-auto p-6">
                {renderCalendar(true)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
