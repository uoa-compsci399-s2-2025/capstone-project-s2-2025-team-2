import { CiLocationOn } from "react-icons/ci"
import Image from "next/image"

interface ReagentCardProps {
  name: string
  description: string
  tags: string[]
  location: string
  expiryDate: string
  imageUrl: string
  quantity: string
  formula?: string
}

const ReagentCard = ({
  name,
  description,
  tags,
  location,
  expiryDate,
  imageUrl,
  quantity,
  formula,
}: ReagentCardProps) => {
  return (
    <div
      className="
           md:w-[20rem] md:h-[24rem] 
           w-[15rem] h-[7.5rem]
           border-white border-solid border-[1.5px] rounded-xl
           bg-primary
       "
    >
      <p className="underline-offset-2 underline m-4 text-xs flex gap-1">
        <CiLocationOn className="w-4 h-4" />
        {location}
      </p>
      <div className="m-4 border border-white rounded-lg overflow-hidden relative h-32">
        <Image
          src="https://carbonsix.co.nz/wp-content/uploads/2023/04/ethanol-96-192-proof-1.jpg"
          fill
          className="object-cover"
          alt=""
        />
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex flex-wrap gap-1">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-black/30 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      <span className="flex mx-4 items-center gap-8">
        {" "}
        <h3 className="text-white italic">{name}</h3>
        <p className="text-white font-light italic mt-1">[{formula}]</p>
      </span>
      <p className="text-light-gray mx-4">{description}</p>

      <span className="flex flex-col gap-1 mx-4 mt-1">
        <p className="text-gray">Expires</p>
        <h4 className="text-red-700 font-light">{expiryDate}</h4>
      </span>

      <div className="w-full bg-light-gray h-[1px]"></div>
    </div>
  )
}

export default ReagentCard
