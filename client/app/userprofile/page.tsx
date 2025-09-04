import ReagentCard from "../components/composite/marketplace/ReagentCard"
import { Unchecked } from "../components/composite/marketplace/ReagentCard.story"
import SidebarLayout from '../components/sidebarLayout'

const UserProfile = () => {
  return (
    <SidebarLayout>
    <div className="bg-white dark:bg-black flex w-[100vw] flex-wrap pt-[2rem]">
      User Profile
      <ReagentCard {...Unchecked.args} />
    </div>
    </SidebarLayout>
  )
}

export default UserProfile
