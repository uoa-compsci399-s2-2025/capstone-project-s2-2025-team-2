import React, { useCallback, useState, useEffect } from "react"
import Image from "next/image"

interface IImageCarousel extends React.HTMLAttributes<HTMLDivElement> {
  images: string[]
  autoPlay?: boolean
  interval?: number
  showIndicators?: boolean
}

const ImageCarousel = ({
  className,
  images,
  autoPlay = false,
  interval = 5000,
  showIndicators = true,
  ...props
}: IImageCarousel) => {
  const ACTION_COOLDOWN = 200

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const goToNext = useCallback(() => {
    if (isTransitioning) return

    setIsTransitioning(true)
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    )

    setTimeout(() => setIsTransitioning(false), ACTION_COOLDOWN)
  }, [images.length, isTransitioning])

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return

    setIsTransitioning(true)
    setCurrentIndex(index)

    setTimeout(() => setIsTransitioning(false), ACTION_COOLDOWN)
  }

  useEffect(() => {
    if (!autoPlay) return

    const intervalId = setInterval(goToNext, interval)
    return () => clearInterval(intervalId)
  }, [autoPlay, interval, goToNext])

  if (images.length === 0) return

  return (
    <div className={["flex flex-col gap-1", className].join(" ")} {...props}>
      <div className="relative flex justify-center px-12">
        <div className="overflow-hidden rounded-lg">
          <div
            className="grid w-96 h-72"
            style={{
              gridTemplateColumns: "100% 1fr",
              gridTemplateRows: "100% 1fr",
            }}
          >
            {images.map((imageUrl, index) => {
              return (
                <div
                  key={index}
                  className={`w-full h-full flex items-center justify-center transition-opacity duration-300 ease-in-out ${index !== currentIndex ? "z-[-100] opacity-0" : "opacity-100"}`}
                  style={{ gridArea: "1 / 1 / 2 / 2" }}
                  aria-hidden={index !== currentIndex}
                >
                  <Image
                    src={imageUrl}
                    alt={`Carousel image ${index + 1}`}
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div>
        {showIndicators && (
          <div className="flex justify-center items-center gap-2 mt-2">
            {images.map((imageUrl, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`relative rounded overflow-hidden transition-all duration-100 ${
                  i === currentIndex
                    ? "w-14 h-10"
                    : "w-12 h-8 opacity-70 hover:opacity-90"
                }`}
              >
                <Image
                  src={imageUrl}
                  alt={`Reagent image ${i + 1}`}
                  fill
                  className={`object-cover ${i === currentIndex ? "brightness-100" : "brightness-65"}`}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageCarousel
