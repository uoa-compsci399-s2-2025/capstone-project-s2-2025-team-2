import ReagentCard from "../components/composite/marketplace/ReagentCard"
import { DefaultReagentCard } from "../components/composite/marketplace/ReagentCard.story"
import Overlay from "../components/composite/Overlay"

// interface needed for auth + content to render

const UserProfile = () => {
  return (
    <Overlay>
      <div>
        <h2 className="text-white/80 m-4">User Profile</h2>
      </div>
      <ReagentCard {...DefaultReagentCard.args} />
    </Overlay>
  )
}

export default UserProfile
