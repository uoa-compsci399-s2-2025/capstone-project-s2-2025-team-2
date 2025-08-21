import Button from "../components/generic/button/regular/Button"

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex gap-8 max-w-6xl w-full justify-center">
        {/* Left side - Sign In Box */}
        <div className="max-w-md w-full space-y-8 p-8 bg-primary rounded-lg shadow-lg">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Sign In</h1>
          <p className="mt-2 text-secondary">Sign in to your account</p>
        </div>
        
        {/* Google OAuth Button */}
        <div className="w-full flex justify-center items-center">
          <button
            type="button"
            className="w-auto flex items-center justify-center rounded-lg bg-primary"
          >
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <svg className="w-8 h-8" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </div>
          </button>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-muted"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-primary text-secondary">or use your account</span>
          </div>
        </div>

        {/* Form Section */}
        <form className="mt-4 space-y-6">
          {/* Input Fields */}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-muted rounded-md shadow-sm placeholder-secondary bg-primary text-white focus:outline-none focus:ring-blue-primary focus:border-blue-primary"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-muted rounded-md shadow-sm placeholder-secondary bg-primary text-white focus:outline-none focus:ring-blue-primary focus:border-blue-primary"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-primary focus:ring-blue-primary border-muted rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-secondary">
                Remember me
              </label>
            </div>
            
            <div className="text-sm">
              <a href="#" className="font-medium text-blue-primary hover:text-blue-secondary">
                Forgot your password?
              </a>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center w-full">
            <Button
              type="submit"
              label="Sign In"
              size="medium"
              className="w-full"
            />
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-secondary">
              Don't have an account?{' '}
              <a href="/auth/signup" className="font-medium text-blue-primary hover:text-blue-secondary">
                Sign up
              </a>
            </p>
          </div>
        </form>
        </div>
        
        {/* Right side - Welcome Box */}
        <div className="max-w-md w-full space-y-8 p-8 bg-gradient-to-b from-blue-400 to-purple-600 rounded-lg shadow-lg flex flex-col justify-center">
          {/* Welcome Content */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome to
            </h1>
            <h1 className="text-4xl font-bold text-orange-400 mb-6">
              Chemical.ly
            </h1>
            <p className="text-lg text-white leading-relaxed mb-8">
              Join Chemical.ly today and be part of a growing community that shares, reuses, and collaborates on research reagents.
            </p>
            {/* Call to Action Button */}
            <Button
              label="Sign Up"
              size="medium"
              className="w-full bg-white text-blue-600 hover:bg-gray-100 border-2 border-white"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
