import Image from "next/image"
import Link from "next/link"
import Collaborate from "./Icons/Collaborate"
import ReduceWaste from "./Icons/ReduceWaste"
import SaveMoney from "./Icons/SaveMoney"

const Landing = () => {
  return (
    <div 
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative"
    >

      {/*Top bar*/}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/50 dark:bg-black/75 backdrop-blur-sm border-b border-gray-200/20 dark:border-gray-700/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-4">
          <div className="flex items-center justify-between h-16">
            <h2 className="text-2xl text-black dark:text-white">
              CoLab
            </h2>
            {/* Optional: Add navigation or buttons here */}
            <div className="flex items-center gap-4">
              <Link href="/auth">
                <button className="px-4 py-2 text-sm font-medium text-blue-primary dark:text-[#FFB276] hover:underline">
                  Sign In
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Semi-transparent overlay */}
      <div className="mt-[100vh] absolute inset-0 bg-white/50 dark:bg-black/75"></div>
      
      {/* Content wrapper with relative positioning */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="mt-[20vh] max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 mb-[20rem]">
        <div className="w-full lg:w-1/2">

            <h1 className="text-4xl md:text-5xl font-bold text-blue-primary dark:text-[#FFB276] mb-4 animate-slide-up-1">
              Access Lab-Grade Reagents
              <br />
              <span className="text-blue-secondary dark:text-[#FF7C5C]">
                For Student Success
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-[#D3DAFF] mb-8 leading-relaxed animate-slide-up-2">
              Chemical.ly connects chemistry students with affordable,
              high-quality reagents. Share resources, reduce waste, and advance
              your academic research with our comprehensive platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up-2">
              <Link href="/auth" className="w-full sm:w-auto">
                <button
                  className="
                    w-full sm:w-auto px-8 py-4 bg-blue-primary text-white font-semibold rounded-lg shadow-md hover:bg-blue-secondary transition
                    dark:bg-[#FF7C5C] dark:hover:bg-[#FF947A]
                  "
                >
                  Get Started
                </button>
              </Link>
              <Link href="/about" className="w-full sm:w-auto">
                <button
                  className="
                    w-full sm:w-auto px-8 py-4 bg-transparent text-blue-primary border-2 border-blue-primary font-semibold rounded-lg hover:bg-blue-primary hover:text-white transition
                    dark:text-[#FFB276] dark:border-[#FFB276] dark:hover:bg-[#FFB276] dark:hover:text-primary
                  "
                >
                  Learn More
                </button>
              </Link>
            </div>
        </div>

      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto mt-16 ">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
          {/* Card 1 */}
          <div className="flex flex-col items-center bg-white dark:bg-primary/95 rounded-2xl shadow-lg p-6 hover:shadow-xl transition duration-300 border border-gray-100 dark:border-gray-800 h-full">
            <ReduceWaste />
            <h3 className="mt-4 text-xl font-bold text-blue-primary dark:text-[#FFB276] text-center">
              Sustainable Research
            </h3>
            <p className="mt-3 text-gray-600 dark:text-[#D3DAFF] text-center">
              Minimize environmental impact by exchanging unused chemicals. Our
              platform facilitates responsible reagent sharing between
              departments and labs.
            </p>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col items-center bg-white/95 dark:bg-primary/95 rounded-2xl shadow-lg p-6 hover:shadow-xl transition duration-300 border border-gray-100 dark:border-gray-800 h-full">
            <SaveMoney />
            <h3 className="mt-4 text-xl font-bold text-blue-primary dark:text-[#FFB276] text-center">
              Budget Optimization
            </h3>
            <p className="mt-3 text-gray-600 dark:text-[#D3DAFF] text-center">
              Access high-quality reagents at student-friendly prices. Extend
              your research budget with cost-effective alternatives to
              commercial suppliers.
            </p>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col items-center bg-white/95 dark:bg-primary/95 rounded-2xl shadow-lg p-6 hover:shadow-xl transition duration-300 border border-gray-100 dark:border-gray-800 h-full">
            <Collaborate />
            <h3 className="mt-4 text-xl font-bold text-blue-primary dark:text-[#FFB276] text-center">
              Scientific Community
            </h3>
            <p className="mt-3 text-gray-600 dark:text-[#D3DAFF] text-center">
              Connect with fellow chemistry students and researchers across
              institutions. Exchange knowledge, build networks, and foster
              interdisciplinary collaborations.
            </p>
          </div>
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-blue-primary dark:text-[#FFB276] mb-6">
          Transforming Academic Research Resources
        </h2>
        <p className="text-center text-gray-600 dark:text-[#D3DAFF] mb-12 max-w-3xl mx-auto px-4">
          Our platform helps chemistry students and researchers optimize their
          lab resources through our innovative sharing ecosystem.
        </p>


      </div>

      {/* Call to Action */}
      <div className="max-w-7xl mx-auto mt-20 bg-white/90 dark:bg-primary/90 rounded-2xl text-center">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-primary p-10 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-primary dark:text-[#FFB276] mb-4">
            Ready to elevate your laboratory experience?
          </h2>
          <p className="text-lg text-gray-600 dark:text-[#D3DAFF] mb-8 max-w-2xl mx-auto">
            Join Chemical.ly today and become part of a growing network of
            chemistry students dedicated to sustainable, efficient research
            practices.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <button
                className="
                  px-8 py-4 bg-blue-primary text-white font-semibold rounded-lg shadow-md hover:bg-blue-secondary transition
                  dark:bg-[#FF7C5C] dark:hover:bg-[#FF947A]
                "
              >
                Join Now
              </button>
            </Link>
            <Link href="/about">
              <button
                className="
                  px-8 py-4 bg-transparent text-blue-primary border-2 border-blue-primary font-semibold rounded-lg hover:bg-blue-primary hover:text-white transition
                  dark:text-[#FFB276] dark:border-[#FFB276] dark:hover:bg-[#FFB276] dark:hover:text-primary
                "
              >
                Learn More
              </button>
            </Link>
          </div>
        </div>
      </div>
      </div> {/* Close content wrapper */}
    </div>
  )
}

export default Landing
