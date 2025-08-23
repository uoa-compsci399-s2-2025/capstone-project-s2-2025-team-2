import { FaMoneyBills } from "react-icons/fa6";
const SaveMoney = () => {
    
    return ( 
        <div className="text-[#3CD856] font-bold flex items-center w-[15rem] justify-center mx-auto mt-[1.5rem]">
            <div className="bg-[#3CD856]/[0.3] rounded-full p-4 inline-flex items-center justify-center">
                <FaMoneyBills size={30} className="text-[#3CD856]" />
            </div>

            <span className=" ml-[1rem] tracking-wider">Save Money</span>
        </div>
     );
}
 
export default SaveMoney;