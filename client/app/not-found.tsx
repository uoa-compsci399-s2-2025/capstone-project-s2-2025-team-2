const NotFound = () => (
  <div className="w-full h-[100vh] bg-primary flex flex-col justify-center items-center">
    <h1 className="text-white">404</h1>
    <h2 className="text-white/50">Page Not Found</h2>
    <p>Sorry, we couldn't find the page you're looking for.</p>
    <a href="/" className="text-white underline mt-4">
      Go back to marketplace
    </a>
  </div>
)

export default NotFound
