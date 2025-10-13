import Image from "next/image"
import logo from "@/public/ChemicallyLogo.webp"
import icon from "@/public/ChemicallyIcon.webp"

const Header = () => {
  return (
    <div>
      <div
        className="
                text-center pt-[1.2rem] text-black text-[25px] font-light mb-[1rem] font-sans
                dark:text-[#D3DAFF] lg:hidden
            "
      >
        <span>CoLab</span>
        <div className="relative w-[250px] h-[100px] mx-auto mt-[3rem]">
          <Image src={logo} alt="CoLab Logo" fill className="object-contain" />
        </div>
        <span className="block mt-[3rem] text-[32px]">Reduce, Reuse</span>
      </div>
      <div className="hidden lg:flex lg:justify-start lg:items-center lg:pb-[3rem]">
        <Image src={icon} alt="CoLab Icon" width={50} height={50} />
        <span
          className="
                    lg:ml-[1rem] lg:font-bold lg:dark:text-[#D3DAFF]
                    lg:text-[1.5rem]
                "
        >
          CoLab
        </span>
      </div>
    </div>
  )
}

export default Header
