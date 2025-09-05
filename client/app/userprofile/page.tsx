import ReagentCard from "../components/composite/marketplace/ReagentCard"
import { DefaultReagentCard } from "../components/composite/marketplace/ReagentCard.story"
import Overlay from "../components/composite/sidebar/Overlay"

const UserProfile = () => {
  return (
    <Overlay>
    <div className="bg-white dark:bg-black flex w-[100vw] flex-wrap pt-[2rem]">
      User Profile
      <ReagentCard {...DefaultReagentCard.args} />
    </div>
    </Overlay>
  )
}

export default UserProfile
