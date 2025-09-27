import Image from "next/image"
import Link from "next/link"
import Collaborate from "./Icons/Collaborate"
import ReduceWaste from "./Icons/ReduceWaste"
import SaveMoney from "./Icons/SaveMoney"
import logo from "@/public/ChemicallyLogo.webp"

const Landing = () => {
  return (
    <div
      className="
            lg:bg-white lg:p-8 lg:pl-[5rem] lg:rounded-[20px]
            lg:dark:bg-primary
        "
    >
      <div className="hidden lg:block">
        <Image
          src={logo}
          alt="Chemical.ly Logo"
          width={550}
          height={450}
          className="absolute top-[12rem] right-[5rem] w-[40vw] h-auto"
        />
      </div>
      <span
        className="
                hidden lg:block lg:font-sans lg:text-[35px] lg:font-light
                lg:pl-[3rem] mb-[1.5rem] lg:pt-[1rem]
                lg:dark:text-[#D3DAFF]
            "
      >
        Reduce, Reuse
      </span>
      <div
        className="
                bg-gradient-to-b from-[#FF947A]/[0.55] from-10% via-white/0 via-70% to-white mx-[1.5rem] rounded-[20px] h-full
                dark:from-[#51AFFF]/[0.48] dark:from-10% dark:to-primary dark:to-100%
                text-center py-[1rem] flex flex-col font-sans shadow-lg
                
                lg:shadow-none lg:rounded-[40px]
                lg:bg-gradient-to-r lg:from-[#FF947A]/[0.55] lg:from-10% lg:via-white/0 lg:via-85% lg:to-white
                lg:pl-[3rem] lg:items-start lg:m-0
            "
      >
        <span
          className="
                    block text-blue-primary text-[70px] font-semibold
                    dark:text-[#FFB276]
                    
                    lg:text-[70px]
                "
        >
          REAGENT
        </span>
        <div
          className="
                    text-[30px] px-[30px] my-[2.6rem]
                    lg:p-0 lg:text-left lg:text-[25px] lg:w-[32rem]
                "
        >
          A collaborative platform for universities to share, trade and reuse
          research reagents.
          <br />
          <br />
          Save money, reduce waste, and strengthen academic connections.
        </div>
        <div
          className="
                    flex flex-col lg:pb-[2rem] text-[30px] mt-[3rem]
                    lg:flex-row
                "
        >
          <Link href="/auth">
            <button
              className="
                          mt-[3rem] px-[3.5rem] py-3 bg-blue-primary text-white font-semibold rounded-lg hover:bg-blue-secondary
                          mx-auto dark:bg-[#FF7C5C] lg:mr-[3rem] hover:cursor-pointer
                      "
            >
              Get Started
            </button>
          </Link>
          <button
            className="
                        mt-[3rem] px-[3.9rem] py-3 bg-transparent text-black font-extralight rounded-lg
                        mx-auto  border-black border-solid border-[2px] hover:cursor-pointer

                        dark:text-white dark:border-white
                    "
          >
            Learn More
          </button>
        </div>
        <div
          className="
                    mx-auto w-[17rem] mb-[2rem] text-left
                    lg:hidden
                "
        >
          <ReduceWaste />
          <SaveMoney />
          <Collaborate />
        </div>
      </div>
      <div className="hidden lg:flex lg:my-[3rem] lg:justify-center lg:gap-[2.5rem]">
        <ReduceWaste />
        <SaveMoney />
        <Collaborate />
      </div>
    </div>
  )
}

export default Landing
