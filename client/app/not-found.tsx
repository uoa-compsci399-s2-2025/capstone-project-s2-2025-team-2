const NotFound = () => (
  <div className="w-full h-[100vh] bg-primary flex flex-col justify-center items-center gap-2">
    <h1 className="text-white">404</h1>
    <h2 className="text-white/70">Page Not Found</h2>
    <p>Sorry, we couldn't find the page you're looking for.</p>
    <a
      href="/marketplace"
      className="text-white underline mt-4 hover:text-white/80"
    >
      Go back to marketplace
    </a>
  </div>
)

export default NotFound
