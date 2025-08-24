import Image from "next/image";
import Collaborate from "./Icons/Collaborate";
import ReduceWaste from "./Icons/ReduceWaste";
import SaveMoney from "./Icons/SaveMoney";
import logo from "@/assets/ChemicallyLogo.webp";

const Landing = () => {
    return ( 
        <div className="
            md:bg-white md:p-8 md:pl-[5rem] md:rounded-[20px]
            md:dark:bg-primary
        ">
            <div className="hidden md:block">
                <Image
                    src={logo}
                    alt="Chemical.ly Logo"
                    width={550}
                    height={450}
                    className="absolute top-[12rem] right-[5rem]"
                />
            </div>
            <span className="
                hidden md:block md:font-sans md:text-[35px] md:font-light
                md:pl-[3rem] mb-[1.5rem] md:pt-[1rem]
                md:dark:text-[#D3DAFF]
            ">Reduce, Reuse</span>
            <div className="
                bg-gradient-to-b from-[#FF947A]/[0.55] from-10% via-white/0 via-70% to-white mx-[1.5rem] rounded-[20px] h-full
                dark:from-[#51AFFF]/[0.48] dark:from-10% dark:to-primary dark:to-100%
                text-center py-[1rem] flex flex-col font-sans shadow-lg
                
                md:shadow-none md:rounded-[40px]
                md:bg-gradient-to-r md:from-[#FF947A]/[0.55] md:from-10% md:via-white/0 md:via-85% md:to-white
                md:pl-[3rem] md:items-start md:m-0
            ">
                <span className="
                    block text-blue-primary text-[70px] font-semibold
                    dark:text-[#FFB276]
                    
                    md:text-[70px]
                ">REAGENT</span>
                <div className="
                    text-[30px] px-[30px] my-[2.6rem]
                    md:p-0 md:text-left md:text-[25px] md:w-[32rem]
                ">
                    A collaborative platform for universities to share, trade and reuse research reagents.
                    <br/><br/>
                    Save money, reduce waste, and strengthen academic connections.      
                </div>
                <div className="flex flex-col md:pb-[2rem] text-[30px] mt-[3rem]">
                    <button className="
                        px-[3.5rem] py-3 bg-blue-primary text-white font-semibold rounded-lg hover:bg-blue-secondary
                        mx-auto dark:bg-[#FF7C5C] md:mr-[3rem] hover:cursor-pointer
                    ">
                        Get Started
                    </button>
                    <button className="
                        mt-[3rem] px-[3.9rem] py-3 bg-transparent text-black font-extralight rounded-lg
                        mx-auto  border-black border-solid border-[2px] hover:cursor-pointer

                        dark:text-white dark:border-white
                    ">
                        Learn More
                    </button>
                </div>
                <div className="
                    mx-auto w-[17rem] mb-[2rem] text-left
                    md:hidden
                ">
                    <ReduceWaste/>
                    <SaveMoney/>
                    <Collaborate/>
                </div>
            </div>
            <div className="hidden md:flex md:my-[3rem] md:justify-center md:gap-[2.5rem]">
                <ReduceWaste/>
                <SaveMoney/>
                <Collaborate/>
            </div>
        </div>
     );
}
 
export default Landing;