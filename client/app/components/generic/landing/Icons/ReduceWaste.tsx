import { FaFlask } from "react-icons/fa";
const ReduceWaste = () => {
    return ( 
        <div className="
            text-[#FF947A] font-bold flex items-center mt-[4rem]
            md:m-0 md:flex-col md:align-middle
        ">
            <div className="
                bg-[#FF947A]/[0.3] rounded-full p-4 inline-flex 
                md:p-5
            ">
                <FaFlask size={30} className="text-[#FF947A] md:hidden" />
                <FaFlask size={40} className="text-[#FF947A] hidden md:block" />
            </div>

            <span className="
                ml-[1rem] tracking-wider
                md:m-0 md:mt-[1rem] md:text-[20px]
            ">Reduce Waste</span>
        </div>
     );
}
 
export default ReduceWaste;