import Collaborate from "./Icons/Collaborate";
import ReduceWaste from "./Icons/ReduceWaste";
import SaveMoney from "./Icons/SaveMoney";

const Landing = () => {
    return ( 
        <div>
            <div className="
                bg-gradient-to-b from-[#FF947A]/[0.55] from-10% via-white/0 via-70% to-white mx-[1.5rem] rounded-[20px] h-full
                dark:from-[#51AFFF]/[0.48] dark:from-10% dark:via-black/0 dark:via-70% dark:to-primary
                text-center py-[1rem] flex flex-col font-sans
            ">
                <span className="
                    block text-blue-primary text-[50px] font-semibold
                    dark:text-[#FFB276]
                ">Reagent</span>
                <div className="text-[20px] px-[30px] my-[2.6rem]">
                    A collaborative platform for universities to share, trade and reuse research reagents.
                    <br/><br/>
                    Save money, reduce waste, and strengthen academic connections.      
                </div>
                <button className="
                    px-[3.5rem] py-3 bg-blue-primary text-white font-semibold rounded-lg hover:bg-blue-secondary
                    mx-auto dark:bg-[#FF7C5C]
                ">
                    Get Started
                </button>
                <button className="
                    mt-6 px-[3.5rem] py-3 bg-transparent text-black font-extralight rounded-lg
                    mx-auto  border-black border-solid border-[2px]

                    dark:text-white dark:border-white
                ">
                    Learn More
                </button>
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