import Collaborate from "./Icons/Collaborate";
import ReduceWaste from "./Icons/ReduceWaste";
import SaveMoney from "./Icons/SaveMoney";

const Landing = () => {
    return ( 
        <div className="
            bg-gradient-to-b from-[#FF947A]/[0.55] via-white/0 to-white mx-[1.5rem] rounded-[20px] h-full
            text-center py-[1rem] flex flex-col font-sans
        ">
            <span className="block text-blue-primary text-[50px] font-bold">Reagent</span>
            <div className="text-[20px] px-[30px] my-[2.6rem]">
                A collaborative platform for universities to share, trade and reuse research reagents.
                <br/><br/>
                Save money, reduce waste, and strengthen academic connections.      
            </div>
            <button className="
                px-[3.5rem] py-3 bg-blue-primary text-white font-semibold rounded-lg hover:bg-blue-secondary
                mx-auto
            ">
                Get Started
            </button>
            <button className="
                mt-6 px-[3.5rem] py-3 bg-transparent text-black font-semibold rounded-lg
                mx-auto  border-black border-solid border-[2px]
            ">
                Learn More
            </button>
            <div className="mx-auto w-[13rem] mb-[2rem]">
                <ReduceWaste/>
                <SaveMoney/>
                <Collaborate/>
            </div>
        </div>
     );
}
 
export default Landing;