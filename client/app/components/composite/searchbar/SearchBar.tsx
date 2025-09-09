"use client"
import { MagnifyingGlassIcon, ChevronDownIcon } from "@heroicons/react/24/solid"

interface SearchBarProps {
  search: string
  setSearch: (val: string) => void
  filter: string
  setFilter: (val: string) => void
  sort: "newest" | "oldest" | "name" | ""
  setSort: (val: "newest" | "oldest" | "name" | "") => void
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
    <form
      onSubmit={handleSearch}
      className="flex items-center mx-auto py-1 w-[calc(100vw-4rem)] md:w-[calc(100vw-19rem)]"
    >
      {/* Filter */}
      <div className="relative w-1/5 min-w-27">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="appearance-none bg-primary rounded-tl-md rounded-bl-md text-secondary px-2 py-1 outline-none cursor-pointer w-full shadow-lg"
        >
          <option value="all">Filter by...</option>
          <option value="category">Category</option>
          <option value="date">Date</option>
          <option value="tag">Tag</option>
        </select>
        <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary pointer-events-none shadow-lg" />
      </div>

      {/* Search input */}
      <div className="bg-primary flex items-center flex-1 mx-2 px-2 py-1 shadow-lg">
        <MagnifyingGlassIcon className="h-5 w-5 text-secondary mr-2" />
        <input
          type="text"
          placeholder="Search for reagents, tags and more..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-primary w-full text-secondary placeholder-secondary outline-none"
        />
      </div>

      {/* Sort */}
      <div className="relative w-1/5 min-w-27">
        <select
          value={sort}
          onChange={(e) =>
            setSort(e.target.value as "newest" | "oldest" | "name" | "")
          }
          className="appearance-none bg-primary rounded-tr-md rounded-br-md text-secondary px-2 py-1 outline-none cursor-pointer w-full shadow-lg"
        >
          <option value="">Sort by...</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="name">Name</option>
        </select>
        <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary pointer-events-none" />
      </div>
    </form>
  )
}
