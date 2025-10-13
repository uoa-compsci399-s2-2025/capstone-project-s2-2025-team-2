import Image from "next/image"
import icon from "@/public/ChemicallyIcon.webp"

const Header = () => {
  return (
    <div>
      <div className="flex justify-start items-center pb-[3rem]">
        <Image src={icon} alt="Chemical.ly Icon" width={50} height={50} />
        <span
          className="
                    ml-[1rem] font-bold dark:text-[#D3DAFF]
                    text-[1.5rem]
                "
        >
          CoLab
        </span>
      </div>
    </div>
  )
}

export default Header
