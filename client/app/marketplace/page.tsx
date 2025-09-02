import ReagentCard from "../components/composite/marketplace/ReagentCard";
import { Unchecked } from "../components/composite/marketplace/ReagentCard.story";

const Marketplace = () => {
    return ( 
        <div className="bg-white dark:bg-black flex w-[100vw] flex-wrap pt-[2rem]">
            Marketplace
            <ReagentCard {...Unchecked.args}/>
        </div>
     );
}
 
export default Marketplace;