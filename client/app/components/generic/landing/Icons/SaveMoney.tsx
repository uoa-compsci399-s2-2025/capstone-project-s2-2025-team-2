import { FaMoneyBills } from "react-icons/fa6";
const SaveMoney = () => {
    
    return ( 
        <div className="
            text-[#3CD856] font-bold flex items-center mt-[1.5rem]
            md:m-0 md:flex-col
        ">
            <div className="
                bg-[#3CD856]/[0.3] rounded-full p-4 inline-flex
                md:p-5
            ">
                <FaMoneyBills size={40} className="text-[#3CD856] md:hidden" />
                <FaMoneyBills size={40} className="text-[#3CD856] hidden md:block" />
            </div>

            <span className="
                tracking-wider text-[1.5rem] min-w-[15rem] pl-[1rem]
                md:m-0 md:mt-[1rem] md:text-[20px]
            ">Save Money</span>
        </div>
     );
}
 
export default SaveMoney;