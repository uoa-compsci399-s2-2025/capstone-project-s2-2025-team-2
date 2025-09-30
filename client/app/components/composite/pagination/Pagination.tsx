interface PaginationProps {
     currentPage:number;
     totalPages:number;
     onPageChange:(page:number) => void;
}

export default function Pagination({
     currentPage,
     totalPages,
     onPageChange
}: PaginationProps) {
     return (
          <div>
               <button 
                    onClick={()=> onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4"
                    >
                    Previous
                    </button>
               <span className="px-4">
                    Page {currentPage} of {totalPages}
               </span>
               <button
                    onClick={()=> onPageChange(currentPage +1)}
                    disabled={currentPage === totalPages}
                    className="px-4"
                    >
                         Next
                    </button>
          </div>
     )
}