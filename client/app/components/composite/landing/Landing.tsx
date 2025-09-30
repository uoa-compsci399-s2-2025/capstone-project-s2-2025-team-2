import Image from "next/image"
import Link from "next/link"
import Collaborate from "./Icons/Collaborate"
import ReduceWaste from "./Icons/ReduceWaste"
import SaveMoney from "./Icons/SaveMoney"
import logo from "@/public/ChemicallyLogo.webp"

const Landing = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 mb-20">
        <div className="w-full lg:w-1/2">
          <div className="lg:bg-white lg:p-10 lg:rounded-[20px] lg:shadow-xl lg:dark:bg-primary">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-primary dark:text-[#FFB276] mb-4">
              Access Lab-Grade Reagents
              <br />
              <span className="text-blue-secondary dark:text-[#FF7C5C]">
                For Student Success
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-[#D3DAFF] mb-8 leading-relaxed">
              Chemical.ly connects chemistry students with affordable,
              high-quality reagents. Share resources, reduce waste, and advance
              your academic research with our comprehensive platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
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

        {/* Hero Image */}
        <div className="relative w-full max-w-md lg:max-w-lg">
          <div className="absolute -z-10 w-full h-full bg-gradient-to-r from-[#FF947A]/30 to-transparent rounded-full blur-2xl"></div>
          <Image
            src={logo}
            alt="Chemical.ly Logo"
            width={500}
            height={500}
            className="w-full h-auto drop-shadow-xl"
            priority
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto mt-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-blue-primary dark:text-[#FFB276] mb-6">
          Transforming Academic Research Resources
        </h2>
        <p className="text-center text-gray-600 dark:text-[#D3DAFF] mb-12 max-w-3xl mx-auto px-4">
          Our platform helps chemistry students and researchers optimize their
          lab resources through our innovative sharing ecosystem.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
          {/* Card 1 */}
          <div className="flex flex-col items-center bg-white dark:bg-primary rounded-2xl shadow-lg p-6 hover:shadow-xl transition duration-300 border border-gray-100 dark:border-gray-800 h-full">
            <ReduceWaste className="w-10 h-10" />
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
          <div className="flex flex-col items-center bg-white dark:bg-primary rounded-2xl shadow-lg p-6 hover:shadow-xl transition duration-300 border border-gray-100 dark:border-gray-800 h-full">
            <SaveMoney className="w-10 h-10" />
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
          <div className="flex flex-col items-center bg-white dark:bg-primary rounded-2xl shadow-lg p-6 hover:shadow-xl transition duration-300 border border-gray-100 dark:border-gray-800 h-full">
            <Collaborate className="w-10 h-10" />
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
      </div>

      {/* Call to Action */}
      <div className="max-w-7xl mx-auto mt-20 text-center">
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
    </div>
  )
}

export default Landing
