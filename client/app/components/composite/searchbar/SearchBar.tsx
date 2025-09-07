"use client"
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid"

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
      className="flex items-center mx-auto px-10 py-1 w-full shadow-md"
    >
      {/* Filter */}
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="bg-primary text-secondary px-2 py-1 outline-none cursor-pointer w-1/5"
      >
        <option value="all">Filter by...</option>
        <option value="category">Category</option>
        <option value="date">Date</option>
        <option value="tag">Tag</option>
      </select>

      {/* Search input */}
      <div className="bg-primary flex items-center flex-1 mx-2 px-2 py-1">
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
      <select
        value={sort}
        onChange={(e) =>
          setSort(e.target.value as "newest" | "oldest" | "name" | "")
        }
        className="bg-primary text-secondary px-2 py-1 outline-none cursor-pointer w-1/5"
      >
        <option value="">Sort by...</option>
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="name">Name</option>
      </select>
    </form>
  )
}
