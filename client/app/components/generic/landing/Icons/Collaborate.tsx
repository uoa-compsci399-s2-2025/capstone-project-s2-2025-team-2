import { BsPeopleFill } from "react-icons/bs";
const Collaborate = () => {
    
    return ( 
        <div className="text-[#BF83FF] font-bold flex items-center mt-[1.5rem]">
            <div className="bg-[#BF83FF]/[0.3] rounded-full p-4 inline-flex">
                <BsPeopleFill size={30} className="text-[#BF83FF]" />
            </div>

            <span className=" ml-[1rem] tracking-wider">Collaborate</span>
        </div>
     );
}
 
export default Collaborate;