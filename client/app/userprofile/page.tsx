import ReagentCard from "../components/composite/marketplace/ReagentCard";
import { Unchecked } from "../components/composite/marketplace/ReagentCard.story";

const UserProfile = () => {
    return ( 
        <div className="bg-white dark:bg-black flex w-[100vw] flex-wrap pt-[2rem]">
            User Profile
            <ReagentCard {...Unchecked.args}/>
        </div>
     );
}
 
export default UserProfile;