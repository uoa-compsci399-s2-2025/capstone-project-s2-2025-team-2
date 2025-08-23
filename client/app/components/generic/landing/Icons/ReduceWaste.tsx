import { FaFlask } from "react-icons/fa";
const ReduceWaste = () => {
    return ( 
        <div className="text-[#FF947A] font-bold flex items-center mt-[4rem]">
            <div className="bg-[#FF947A]/[0.3] rounded-full p-4 inline-flex ">
                <FaFlask size={30} className="text-[#FF947A]" />
            </div>

            <span className=" ml-[1rem] tracking-wider">Reduce Waste</span>
        </div>
     );
}
 
export default ReduceWaste;