import { FaRegClock } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
const ReagentCard = () => {
    return ( 
        <div className="
            md:w-[13rem] md:h-[17rem] p-[0.2rem] 
            h-[7.5rem] mx-[2rem] mb-[1.5rem]
            border-blue-secondary dark:border-purple border-solid border-[1.5px] rounded-[15px]
        ">
            <div className="
                h-full flex
                border-dark-gray dark:border-gray-200 border-solid border-[1.5px] rounded-[12px]
            ">
                <div className="
                    bg-amber-400 w-[6rem] h-full
                    rounded-tl-[10px] rounded-bl-[10px]
                ">
                    Image
                </div>
                <div className="ml-[1rem] bg-transparent">
                    <h6 className="text-secondary text-[12px]">Sell / Trade</h6>
                    <h6 className="text-black dark:text-white text-[1.5rem]">Ethanol</h6>
                    <div className="flex items-center text-gray-100">
                        <FaRegClock className="w-5 h-6 mr-[5px] dark:text-red-100"/> <span>25/10/2026</span>
                    </div>
                    <div className="flex text-gray-100">
                        <CiLocationOn className="w-6 h-6 stroke-[1px] -ml-[2px] dark:stroke-lightblue"/> <span>UoA, Auckland</span>
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default ReagentCard;