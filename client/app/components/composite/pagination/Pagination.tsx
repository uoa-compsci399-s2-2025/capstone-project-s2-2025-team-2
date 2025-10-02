import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const getPageNumbers = (currentPage: number, totalPages: number) => {
    const pages: number[] = []
    const windowSize = 4

    const block = Math.floor((currentPage - 1) / (windowSize - 1))

    const start = block * (windowSize - 1) + 1

    let end = start + windowSize - 1
    if (end > totalPages) {
      end = totalPages
    }

    for (let i = start; i <= end; i++) {
      if (i == start && i !== 1 && block !== 0) {
        pages.push(i - 1)
      }
      pages.push(i)
    }

    return pages
  }

  const pages = getPageNumbers(currentPage, totalPages)
  return (
    <div className="flex items-center justify-center mb-[2rem]">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 ${currentPage === 1 ? "invisible" : ""}`}
      >
        <ChevronLeftIcon className="h-5 w-5 text-white" />
      </button>
      <div className="flex gap-1 justify-center">
        {pages.map((page) => {
          return (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`min-w-[2.5rem] px-2 py-2 rounded-md border ${
                currentPage === page
                  ? "bg-white text-primary border-primary"
                  : "bg-primary text-white border-secondary hover:bg-secondary transition-colors duration-200"
              }`}
            >
              {page}
            </button>
          )
        })}
      </div>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 ${currentPage === totalPages ? "invisible" : ""}`}
      >
        <ChevronRightIcon className="h-5 w-5 text-white" />
      </button>
    </div>
  )
}
