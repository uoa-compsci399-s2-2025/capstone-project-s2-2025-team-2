import { LuHouse } from "react-icons/lu";
import { FaRegStar } from "react-icons/fa";

const SellerContact = () => {
    return ( 
        <div className="flex">
            <div className="bg-yellow-600">ProfilePic</div>
            <div>
                <h4 className="text-midnight">Violet Chen</h4>
                <span className="flex items-center"><LuHouse className="text-midnight"/><p className="text-midnight">University of Auckland, City Centre</p></span>
                <span className="text-gold items-center flex"><FaRegStar />99(99.9% Positive Feedback)</span>
            </div>
        </div>
     );
}
 
export default SellerContact;