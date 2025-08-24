import { BsPeopleFill } from "react-icons/bs";
const Collaborate = () => {
    
    return ( 
        <div className="
            text-[#BF83FF] font-bold flex items-center mt-[1.5rem]
            md:m-0 md:flex-col
        ">
            <div className="
                bg-[#BF83FF]/[0.3] rounded-full p-4 inline-flex
                md:p-5
            ">
                <BsPeopleFill size={40} className="text-[#BF83FF] md:hidden" />
                <BsPeopleFill size={40} className="text-[#BF83FF] hidden md:block" />
            </div>

            <span className="
                tracking-wider text-[1.5rem] min-w-[15rem] pl-[1rem]
                md:m-0 md:mt-[1rem] md:text-[20px]
            ">Collaborate</span>
        </div>
     );
}
 
export default Collaborate;