interface loadingState {
    pageName: string
}
const LoadingState = ({pageName}:loadingState) => {
    return ( 
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-secondary">Loading {pageName}...</p>
          </div>
        </div>
     );
}
 
export default LoadingState;