import { FaRegClock } from "react-icons/fa";
import { LuClockAlert } from "react-icons/lu";
import { LuHouse } from "react-icons/lu";
import Tag from "./Tag";
import SellerContact from "./SellerContact";
import ReagentBreadcrumb from "./ReagentBreadcrumb";

const ReagentView = () => {
    return ( 
        <div className="bg-white h-[100vh] font-family-sans  p-[2rem]">
            <ReagentBreadcrumb/>
            <div className="flex flex-col items-center">
                <h1 className="text-black tracking-wider">Hydrogen Peroxide 5%</h1>
                <div className="flex justify-around w-[43rem] mx-auto mt-[1rem]">
                    <h5 className="flex text-green-200 items-center text-[0.8rem]"><FaRegClock className="text-green-200 mr-[0.3rem] w-5 h-5" /> Listed - 25/20/2025</h5>
                    <h5 className="flex text-red-300 items-center text-[0.8rem]"><LuClockAlert className="text-red-300 mr-[0.3rem] w-5 h-5" /> Expires - 25/20/2025</h5>
                    <h5 className="flex text-blue-300 items-center text-[0.8rem]"><LuHouse className="text-blue-300 mr-[0.3rem] w-5 h-5" /> Location - University of Auckland</h5>
                </div>
            </div>
            <div className="flex mt-[2rem]">
                <div className="bg-amber-300 flex-[1]">Images</div>
                <div className="flex-[1.5] ml-[2rem]">
                    <div className="bg-green-300 rounded-[10px] shadow-[0_4px_6px_rgba(0,0,0,0.4)]">
                        <div className="text-center py-[1rem]">
                            <h4 className="text-green-400 font-bold">Current price</h4>
                            <h2 className="text-green-400">$30</h2>
                        </div>
                        <div className="flex bg-gray-300 p-[2rem] rounded-b-[10px]">
                            <div className="flex-[0.25]">
                                <p className="text-dark-gray font-bold mb-[0.7rem]">Category - Chemical</p>
                                <p className="text-dark-gray font-bold mb-[0.7rem]">Condition - New</p>
                                <p className="text-dark-gray font-bold">Quantity - 500ml</p>
                            </div>
                            <div className="flex-[0.75]">
                                <p className="text-dark-gray">Selling a 500 mL bottle of hydrogen peroxide (H₂O₂) reagent, 5% solution. It’s Sigma-Aldrich brand, still sealed and completely full. I originally bought it for a project but ended up not needing it, so it’s brand new and has been stored properly in a cool, dark space since purchase. Expiry is 2026, so plenty of shelf life left. lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem</p>
                                <div className="mt-[3rem] flex"><Tag/><Tag/><Tag/></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-[60vw] mx-auto my-[2rem] h-[1px] bg-gradient-to-r from-transparent via-gray-400 to-transparent" />
            <div className="text-black flex justify-center">
                <SellerContact/>
            </div>
        </div>
     );
}
 
export default ReagentView;