import Image from "next/image";
import Collaborate from "./Icons/Collaborate";
import ReduceWaste from "./Icons/ReduceWaste";
import SaveMoney from "./Icons/SaveMoney";
import logo from "@/assets/ChemicallyLogo.webp";

const Landing = () => {
    return ( 
        <div className="md:bg-white md:p-8 md:pl-[5rem] md:rounded-[20px]">
            
            <span className="
                hidden md:block md:font-sans md:text-[35px] md:font-light
                md:pl-[3rem] mb-[1.5rem] md:pt-[1rem]
            ">Reduce, Reuse</span>
            <div className="
                bg-gradient-to-b from-[#FF947A]/[0.55] from-10% via-white/0 via-70% to-white mx-[1.5rem] rounded-[20px] h-full
                dark:from-[#51AFFF]/[0.48] dark:from-10% dark:via-black/0 dark:via-70% dark:to-primary
                text-center py-[1rem] flex flex-col font-sans shadow-lg
                
                md:shadow-none md:rounded-[40px]
                md:bg-gradient-to-r md:from-[#FF947A]/[0.55] md:from-10% md:via-white/0 md:via-85% md:to-white
                md:pl-[3rem] md:items-start md:m-0
            ">
                <span className="
                    block text-blue-primary text-[50px] font-semibold
                    dark:text-[#FFB276]
                    
                    md:text-[70px]
                ">REAGENT</span>
                <div className="
                    text-[20px] px-[30px] my-[2.6rem]
                    md:p-0 md:text-left md:text-[25px] md:w-[32rem]
                ">
                    A collaborative platform for universities to share, trade and reuse research reagents.
                    <br/><br/>
                    Save money, reduce waste, and strengthen academic connections.      
                </div>
                <div className="">
                    <button className="
                        px-[3.5rem] py-3 bg-blue-primary text-white font-semibold rounded-lg hover:bg-blue-secondary
                        mx-auto dark:bg-[#FF7C5C] md:mr-[3rem] hover:cursor-pointer
                    ">
                        Get Started
                    </button>
                    <button className="
                        mt-6 px-[3.5rem] py-3 bg-transparent text-black font-extralight rounded-lg
                        mx-auto  border-black border-solid border-[1px] hover:cursor-pointer

                        dark:text-white dark:border-white
                    ">
                        Learn More
                    </button>
                </div>
                <div className="
                    mx-auto w-[13rem] mb-[2rem]
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