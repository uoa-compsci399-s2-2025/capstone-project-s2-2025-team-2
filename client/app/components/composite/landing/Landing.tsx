"use client"
import Link from "next/link"
import Collaborate from "./Icons/Collaborate"
import ReduceWaste from "./Icons/ReduceWaste"
import SaveMoney from "./Icons/SaveMoney"
import { useEffect, useRef } from "react"

const Landing = () => {
  const parallaxRef = useRef<HTMLDivElement | null>(null)
  const svgParallaxRef = useRef<HTMLDivElement | null>(null)
  const imageSectionRef = useRef<HTMLDivElement | null>(null)
  const heroRef = useRef<HTMLDivElement | null>(null)
  const featuresRef = useRef<HTMLDivElement | null>(null)
  const ctaRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY

      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translateY(${scrolled * -0.5}px)`
      }

      if (svgParallaxRef.current) {
        svgParallaxRef.current.style.transform = `translateY(${100 + scrolled * -0.3}px)`
      }
    }
    const updateSvgPosition = () => {
      if (imageSectionRef.current && svgParallaxRef.current) {
        const imageSectionHeight = imageSectionRef.current.offsetHeight
        const imageSectionTop = imageSectionRef.current.offsetTop

        // Make SVG larger and position it to show fully behind image section
        svgParallaxRef.current.style.height = `${imageSectionHeight * 2}px`
        svgParallaxRef.current.style.top = `${imageSectionTop - imageSectionHeight * 0.25}px`
      }
    }

    const updateOverlayHeight = () => {
      if (
        heroRef.current &&
        featuresRef.current &&
        ctaRef.current &&
        parallaxRef.current
      ) {
        const heroHeight = heroRef.current.offsetHeight
        const featuresHeight = featuresRef.current.offsetHeight
        const ctaHeight = ctaRef.current.offsetHeight
        const combinedHeight = heroHeight + featuresHeight + ctaHeight
        const viewportWidth = window.innerWidth

        let heightMultiplier = 1
        if (viewportWidth >= 1920) {
          heightMultiplier = 1.05
        } else if (viewportWidth >= 1200) {
          heightMultiplier = 1.3
        } else if (viewportWidth >= 1024) {
          heightMultiplier = 0.9
        } else if (viewportWidth >= 820) {
          heightMultiplier = 1.1
        } else if (viewportWidth >= 768) {
          heightMultiplier = 1.3
        } else {
          heightMultiplier = 1.3
        }

        parallaxRef.current.style.height = `${combinedHeight * heightMultiplier}px`
      }
    }
    handleScroll()
    updateSvgPosition()
    updateOverlayHeight()

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", () => {
      handleScroll()
      updateSvgPosition()
      updateOverlayHeight()
    })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", updateSvgPosition)
    }
  }, [])

  const scrollToFeatures = () => {
    if (featuresRef.current) {
      const elementRect = featuresRef.current.getBoundingClientRect()
      const elementTop = elementRect.top + window.pageYOffset
      const headerOffset = 110

      const scrollTo = elementTop - headerOffset

      window.scrollTo({
        top: scrollTo,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="min-h-screen py-12 relative">
      {/*Top bar*/}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/50 dark:bg-black/75 backdrop-blur-sm border-b border-gray-200/20 dark:border-gray-700/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-4">
          <div className="flex items-center justify-between h-[5rem]">
            <h2 className="text-2xl text-black dark:text-white">CoLab</h2>
            <div className="flex items-center md:gap-4">
              <Link href="/marketplace">
                <button className="px-4 cursor-pointer py-2 text-sm font-medium text-blue-primary dark:text-[#FFB276] hover:text-blue-primary/70 hover:dark:text-[#FF7C5C] transition">
                  Marketplace
                </button>
              </Link>
              <button
                onClick={scrollToFeatures}
                className="px-4 py-2 text-sm cursor-pointer font-medium text-blue-primary dark:text-[#FFB276] hover:text-blue-primary/70 hover:dark:text-[#FF7C5C] transition"
              >
                About
              </button>
              <Link href="/auth">
                <button className="px-4 py-2 cursor-pointer text-sm font-medium text-blue-primary dark:text-[#FFB276] hover:text-blue-primary/70 hover:dark:text-[#FF7C5C] transition">
                  Sign In
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Semi-transparent overlay */}
      {/* <div
        ref={parallaxRef}
        className="mt-[110vh] md:mt-[90vh] lg:mt-[120vh] absolute inset-0 bg-white/60 dark:bg-black/75 h-[290vh] z-0 rounded-md"
      ></div> */}
      {/* Content wrapper with relative positioning */}
      <div className="relative z-10 mb-20 pl-4 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8 ">
        {/* Hero Section */}
        <div
          ref={heroRef}
          className="mt-[20vh] md:mt-[15vh] max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 mb-[13rem] pl-4 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8"
        >
          <div className="lg:ml-[3rem] w-full lg:w-1/2 bg-white/90 dark:bg-primary/90 lg:bg-transparent lg:dark:bg-transparent rounded-2xl p-6">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-primary dark:text-[#FFB276] mb-4 animate-slide-up-1">
              Access Lab-Grade Reagents
              <br />
              <span className="text-blue-secondary dark:text-[#FF7C5C]">
                For Student Success
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-[#D3DAFF] mb-8 leading-relaxed animate-slide-up-2">
              CoLab connects chemistry students with affordable, high-quality
              reagents. Share resources, reduce waste, and advance your academic
              research with our comprehensive platform.
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
              <div className="w-full sm:w-auto">
                <button
                  onClick={scrollToFeatures}
                  className="
                    w-full sm:w-auto px-8 py-4 bg-transparent text-blue-primary border-2 border-blue-primary font-semibold rounded-lg hover:bg-blue-primary hover:text-white transition
                    dark:text-[#FFB276] dark:border-[#FFB276] dark:hover:bg-[#FFB276] dark:hover:text-primary
                  "
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div
          ref={featuresRef}
          className="max-w-7xl mx-auto pl-4 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
            {/* Card 1 */}
            <div className="flex flex-col items-center bg-white dark:bg-primary/95 rounded-2xl shadow-lg p-6 hover:shadow-xl transition duration-300 border border-gray-100 dark:border-gray-800 h-full">
              <ReduceWaste />
              <h3 className="mt-4 text-xl font-bold text-blue-primary dark:text-[#FFB276] text-center">
                Sustainable Research
              </h3>
              <p className="mt-3 text-gray-600 dark:text-[#D3DAFF] text-center">
                Minimize environmental impact by exchanging unused chemicals.
                Our platform facilitates responsible reagent sharing between
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

          {/* SVG Background for image section */}
          <div
            ref={svgParallaxRef}
            className="absolute left-0 right-0 -z-10"
            style={{
              backgroundImage: "url('/Animated Shape.svg')",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              height: "100vh",
              top: "110vh", // Position it roughly where the image section is
            }}
          ></div>

          {/*image section */}
          <div
            ref={imageSectionRef}
            className="flex flex-col lg:flex-row items-center justify-center gap-20 mt-30 mb-20 relative pl-4 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8"
          >
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-bold text-left text-blue-primary dark:text-[#FFB276]">
                Transforming Academic
                <br />
                <span className="text-blue-secondary dark:text-[#FF7C5C]">
                  Research Resources
                </span>
              </h2>
              <p className="text-left text-gray-600 dark:text-[#D3DAFF] max-w-xl">
                Our platform helps chemistry students and researchers optimize
                their lab resources through our innovative sharing ecosystem.
              </p>
            </div>

            <img
              src="/CoLabLanding.jpg"
              alt="Research collaboration"
              className="w-100 h-120 object-cover shadow-md  z-10"
            />
          </div>
        </div>

        {/* Call to Action */}
        <div
          ref={ctaRef}
          className="max-w-7xl mx-auto mt-30 bg-white/90 dark:bg-primary/90 rounded-2xl text-center "
        >
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-primary p-10 pl-4 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-primary dark:text-[#FFB276] mb-4">
              Ready to elevate your laboratory experience?
            </h2>
            <p className="text-lg text-gray-600 dark:text-[#D3DAFF] mb-8 max-w-2xl mx-auto">
              Join CoLab today and become part of a growing network of chemistry
              students dedicated to sustainable, efficient research practices.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <button
                  className="
                  px-8 py-4 bg-blue-primary text-white font-semibold rounded-lg shadow-md hover:bg-blue-primary/70 transition
                  dark:bg-[#FF7C5C] dark:hover:bg-[#FF947A] cursor-pointer
                "
                >
                  Join Now
                </button>
              </Link>
              <Link href="/marketplace">
                <button
                  className="
                  px-8 py-4 bg-transparent text-blue-primary border-2 border-blue-primary font-semibold rounded-lg hover:bg-blue-primary hover:text-white transition
                  dark:text-[#FFB276] dark:border-[#FFB276] dark:hover:bg-[#FFB276] dark:hover:text-primary cursor-pointer
                "
                >
                  Marketplace
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>{" "}
      {/* Close content wrapper */}
    </div>
  )
}

export default Landing
