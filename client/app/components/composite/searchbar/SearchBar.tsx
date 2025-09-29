"use client"
import { MagnifyingGlassIcon, ChevronDownIcon } from "@heroicons/react/24/solid"

interface SearchBarProps {
  search: string
  setSearch: (val: string) => void
  filter: string
  setFilter: (val: string) => void
  sort: "oldest" | "newest" | "nameAZ" | "nameZA" | ""
  setSort: (val: "newest" | "oldest" | "nameAZ" | "nameZA" | "") => void
}

export default function SearchBar({
  search,
  setSearch,
  filter,
  setFilter,
  sort,
  setSort,
}: SearchBarProps) {
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Search:", search, "Filter:", filter, "Sort:", sort)
  }

  return (
    <form onSubmit={handleSearch} className="flex items-center py-1">
      {/* Filter */}
      <div className="relative w-1/5 min-w-27">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="appearance-none bg-primary rounded-tl-md rounded-bl-md text-white px-2 py-1 outline-none cursor-pointer w-full shadow-lg"
        >
          <option value="all">Filter by...</option>
          <option value="category">Category</option>
          <option value="date">Date</option>
          <option value="tag">Tag</option>
        </select>
        <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary pointer-events-none shadow-lg" />
      </div>

      {/* Search input */}
      <div className="bg-primary flex items-center flex-1 ml-2 px-2 py-1 shadow-lg md:mr-2">
        <MagnifyingGlassIcon className="h-5 w-5 text-secondary mr-2" />
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-primary w-full text-white placeholder-secondary outline-none truncate md:hidden"
        />

        <input
          type="text"
          placeholder="Search for reagents, tags and more..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-primary w-full text-white placeholder-secondary outline-none hidden md:block"
        />
      </div>

      {/* Sort */}
      <div className="relative w-1/5 min-w-27 hidden md:flex">
        <select
          value={sort}
          onChange={(e) =>
            setSort(
              e.target.value as "newest" | "oldest" | "nameAZ" | "nameZA" | "",
            )
          }
          className="appearance-none bg-primary rounded-tr-md rounded-br-md text-white px-2 py-1 outline-none cursor-pointer w-full shadow-lg"
        >
          <option value="">Sort by...</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="nameAZ">Name [A - Z]</option>
          <option value="nameZA">Name [Z - A]</option>
        </select>
        <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary pointer-events-none" />
      </div>
    </form>
  )
}
