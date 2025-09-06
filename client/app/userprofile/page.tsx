import ReagentCard from "../components/composite/marketplace/ReagentCard"
import { DefaultReagentCard } from "../components/composite/marketplace/ReagentCard.story"
import Overlay from "../components/composite/sidebar/Overlay"

const UserProfile = () => {
  return (
    <Overlay>
    <div className="dark:bg-black flex flex-wrap pt-[2rem]">
      User Profile

    </div>
          <ReagentCard {...DefaultReagentCard.args} />
    </Overlay>
  )
}

export default UserProfile
