import { LuHouse } from "react-icons/lu";
import { FaRegStar } from "react-icons/fa";

const SellerContact = () => {
    return ( 
        <div className="flex flex-row items-center">
            <div className="bg-yellow-600 rounded-[50%] flex flex-col justify-center items-center h-[4rem] w-[4rem]">PFP</div>
            <div className="ml-[1rem]">
                <h4 className="text-midnight text-[1rem] font-bold">Violet Chen</h4>
                <span className="flex items-center text-[0.8rem] text-midnight font-bold"><LuHouse/>
                    University of Auckland, City Centre
                </span>
                <span className="text-gold items-center flex text-[0.8rem] font-bold"><FaRegStar />
                    99(99.9% Positive Feedback)
                </span>
            </div>
        </div>
     );
}
 
export default SellerContact;