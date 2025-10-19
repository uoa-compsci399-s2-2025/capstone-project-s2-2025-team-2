"use client"
import { MagnifyingGlassIcon, ChevronDownIcon } from "@heroicons/react/24/solid"
import { useState, useRef, useEffect } from "react"

interface DropdownOption {
  value: string
  label: string
}

interface CustomDropdownProps {
  value: string
  onChange: (value: string) => void
  options: DropdownOption[]
  placeholder?: string
  className?: string
}

//custom dropdown component to replace select
function CustomDropdown({
  value,
  onChange,
  options,
  placeholder = "Select...",
  className = "",
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  //click outside dropdown to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    //add event listener when dropdown is open
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  //option selection handler, close dropdown
  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  //dropdown labels
  const selectedLabel =
    options.find((opt) => opt.value === value)?.label || placeholder

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/*dropdown button*/}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-primary text-white px-2 py-1 pr-8 border border-secondary/20 shadow-lg hover:bg-primary/90 transition-colors outline-none"
      >
        <span className="truncate">{selectedLabel}</span>
        {/*open dropdown rotates chevron*/}
        <ChevronDownIcon
          className={`absolute right-2 h-5 w-5 text-secondary transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/*dropdown menu only renders for "open" state*/}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-primary border border-secondary/20 rounded-md shadow-xl z-50 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`w-full text-left px-3 py-1 text-white hover:bg-secondary/20 transition-colors ${
                value === option.value ? "font-medium bg-secondary/10" : ""
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

interface SearchBarProps {
  search: string
  setSearch: (val: string) => void
  filter: string
  setFilter: (val: string) => void
  sort: "latestExpiry" | "earliestExpiry" | "nameAZ" | "nameZA" | ""
  setSort: (
    val: "earliestExpiry" | "latestExpiry" | "nameAZ" | "nameZA" | "",
  ) => void
}

//dropdown options for filter and sort
const FILTER_OPTIONS: DropdownOption[] = [
  { value: "all", label: "Filter by..." },
  { value: "category", label: "Category" },
  { value: "expiryDate", label: "Expiry Date" },
  { value: "condition", label: "Condition" },
  { value: "location", label: "Location" },
  { value: "tradingType", label: "Trading Type" },
]

const SORT_OPTIONS: DropdownOption[] = [
  { value: "", label: "Sort by..." },
  { value: "earliestExpiry", label: "Earliest Expiry" },
  { value: "latestExpiry", label: "Latest Expiry" },
  { value: "nameAZ", label: "Name [A - Z]" },
  { value: "nameZA", label: "Name [Z - A]" },
]

export default function SearchBar({
  search,
  setSearch,
  filter,
  setFilter,
  sort,
  setSort,
}: SearchBarProps) {
  return (
    <div className="flex items-center py-1 gap-1">
      {/*custom filter dropdown*/}
      <CustomDropdown
        value={filter}
        onChange={setFilter}
        options={FILTER_OPTIONS}
        className="w-1/3 md:w-1/5 min-w-32 [&>button]:rounded-l-md"
      />

      {/*search input*/}
      <div className="flex-1 flex items-center bg-primary px-2 py-1 border border-secondary/20 shadow-lg">
        <MagnifyingGlassIcon className="h-5 w-5 text-secondary mr-2 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search for reagents, tags and more..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-white placeholder-secondary outline-none"
        />
      </div>

      {/*custom sort dropdown*/}
      <CustomDropdown
        value={sort}
        onChange={(val) => setSort(val as typeof sort)}
        options={SORT_OPTIONS}
        className="w-1/3 md:w-1/5 min-w-32 [&>button]:rounded-r-md"
      />
    </div>
  )
}
