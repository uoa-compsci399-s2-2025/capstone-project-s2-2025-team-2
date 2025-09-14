import ReagentCard from "../components/composite/reagent/ReagentCard"
import { DefaultReagentCard } from "../components/composite/reagent/ReagentCard.story"
import Overlay from "../components/composite/Overlay"

// interface needed for auth + content to render

const UserProfile = () => {
  return (
    <Overlay>
      <div>
        <h2 className="text-white/80 m-4">User Profile</h2>
      </div>
      <div className="m-4 flex flex-col gap-4">
        <ReagentCard {...DefaultReagentCard.args} />
        <ReagentCard {...DefaultReagentCard.args} />
        <ReagentCard {...DefaultReagentCard.args} />
        <ReagentCard {...DefaultReagentCard.args} />
        <ReagentCard {...DefaultReagentCard.args} />
        <ReagentCard {...DefaultReagentCard.args} />
        <ReagentCard {...DefaultReagentCard.args} />
        <ReagentCard {...DefaultReagentCard.args} />
        <ReagentCard {...DefaultReagentCard.args} />
      </div>
    </Overlay>
  )
}

export default UserProfile
