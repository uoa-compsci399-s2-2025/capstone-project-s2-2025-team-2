import { useState } from "react"
import { FaSearch } from "react-icons/fa"

export default function SearchBar() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [sort, setSort] = useState("newest")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Search:", search)
    console.log("Filter:", filter)
    console.log("Sort:", sort)
    // 🔑 You can hook this into your API call or filtering logic
  }

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center bg-neutral-900 text-gray-300 rounded-md px-2 py-1 w-full max-w-4xl"
    >
      {/* Filter dropdown */}
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="bg-transparent text-gray-400 px-2 py-1 outline-none cursor-pointer"
      >
        <option value="all">Filter by...</option>
        <option value="category">Category</option>
        <option value="date">Date</option>
        <option value="tag">Tag</option>
      </select>

      {/* Search input */}
      <div className="flex items-center flex-1 mx-2 bg-neutral-800 rounded-md px-2">
        <FaSearch className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search for reagents, tags and more..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-gray-200 placeholder-gray-500 outline-none"
        />
      </div>

      {/* Sort dropdown */}
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="bg-transparent text-gray-400 px-2 py-1 outline-none cursor-pointer"
      >
        <option value="newest">Sort by...</option>
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="name">Name</option>
      </select>
    </form>
  )
}
