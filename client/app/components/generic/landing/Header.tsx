import Image from "next/image"
import logo from "@/assets/ChemicallyLogo.webp"
import icon from "@/assets/ChemicallyIcon.webp"

const Header = () => {
  return (
    <div>
      <div
        className="
                text-center pt-[1.2rem] text-black text-[25px] font-light mb-[1rem] font-sans
                dark:text-[#D3DAFF] md:hidden
            "
      >
        <span>Chemical.ly</span>
        <div className="relative w-[250px] h-[100px] mx-auto mt-[3rem]">
          <Image
            src={logo}
            alt="Chemical.ly Logo"
            fill
            className="object-contain"
          />
        </div>
        <span className="block mt-[3rem] text-[32px]">Reduce, Reuse</span>
      </div>
      <div className="hidden md:flex md:justify-start md:items-center md:pb-[3rem]">
        <Image src={icon} alt="Chemical.ly Icon" width={50} height={50} />
        <span
          className="
                    md:ml-[1rem] md:font-bold md:dark:text-[#D3DAFF]
                    md:text-[1.5rem]
                "
        >
          Chemical.ly
        </span>
      </div>
    </div>
  )
}

export default Header
