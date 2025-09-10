import { FaRegClock } from "react-icons/fa";
import { LuClockAlert } from "react-icons/lu";
import { LuHouse } from "react-icons/lu";

const ReagentView = () => {
    return ( 
        <div className="bg-white">
            Reagent View
            <div className="flex flex-col items-center">
                <h1 className="text-black tracking-wider">Hydrogen Peroxide 5%</h1>
                <div className="flex justify-around w-[55rem] mx-auto mt-[1rem]">
                    <h5 className="flex text-green-200 items-center text-[1rem]"><FaRegClock className="text-green-200 mr-[0.3rem] w-5 h-5" /> Listed - 25/20/2025</h5>
                    <h5 className="flex text-red-300 items-center text-[1rem]"><LuClockAlert className="text-red-300 mr-[0.3rem] w-5 h-5" /> Expires - 25/20/2025</h5>
                    <h5 className="flex text-blue-300 items-center text-[1rem]"><LuHouse className="text-blue-300 mr-[0.3rem] w-5 h-5" /> Location - University of Auckland</h5>
                </div>
            </div>
        </div>
     );
}
 
export default ReagentView;