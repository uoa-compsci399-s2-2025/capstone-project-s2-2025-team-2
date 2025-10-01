import { ChevronRightIcon,ChevronLeftIcon } from "@heroicons/react/24/outline"

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
     const getPageNumbers = (): (number | string)[] => {
  const pages: (number | string)[] = []
  const showPaginationStart = currentPage > 2
  const showPaginationEnd = currentPage < totalPages - 2
  
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)
    if (showPaginationStart) {
      pages.push('...')
      const startPage = Math.max(2, currentPage - 1)
      const endPage = Math.min(totalPages - 1, currentPage + 1)

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }
      if (showPaginationEnd) {
        pages.push('...')
      }
    } else {
      for (let i = 2; i <= Math.min(4, totalPages - 1); i++) {
        pages.push(i)
      }
      pages.push('...')
    }
    pages.push(totalPages)
  }
  
  return pages
}
   const pages = getPageNumbers()         
return (
  <div className="flex items-center gap-2 justify-center mb-[2rem]">
<button
  onClick={() => onPageChange(currentPage - 1)}
  disabled={currentPage === 1}
  className={`px-4 ${currentPage === 1 ? 'invisible' : ''}`}
>
  <ChevronLeftIcon className="h-5 w-5 text-white" />
</button>
    <div className="flex gap-1 justify-center">
      {pages.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} className="px-2">
              ...
            </span>
          )
        }
        return (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={
              `px-3 py-2 rounded-md border ${
                currentPage === page
                  ? 'bg-secondary text-white border-secondary'
                  : 'bg-white text-primary border-primary hover:bg-secondary hover:text-white hover:border-secondary transition-colors duration-200'
              }`
            }
          >
            {page}
          </button>
        )
      })}
    </div>
<button
  onClick={() => onPageChange(currentPage + 1)}
  disabled={currentPage === totalPages}
  className={`px-4 ${currentPage === totalPages ? 'invisible' : ''}`}
>
  <ChevronRightIcon className="h-5 w-5 text-white" />
</button>

  </div>
)
}
