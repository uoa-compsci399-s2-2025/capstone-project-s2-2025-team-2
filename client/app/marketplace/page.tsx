import ReagentCard from "../components/composite/marketplace/ReagentCard"
import { Unchecked } from "../components/composite/marketplace/ReagentCard.story"
import SidebarLayout from '../components/sidebarLayout'

const Marketplace = () => {
  return (
    <SidebarLayout>
    <div className="bg-white dark:bg-black flex w-full flex-wrap pt-[2rem]">
      Marketplace
      <ReagentCard {...Unchecked.args} />
      <ReagentCard {...Unchecked.args} />
      <ReagentCard {...Unchecked.args} />
      <ReagentCard {...Unchecked.args} />
      <ReagentCard {...Unchecked.args} />
      <ReagentCard {...Unchecked.args} />
      <ReagentCard {...Unchecked.args} />
      <ReagentCard {...Unchecked.args} />
      <ReagentCard {...Unchecked.args} />
      <ReagentCard {...Unchecked.args} />
      <ReagentCard {...Unchecked.args} />
      <ReagentCard {...Unchecked.args} />
      <ReagentCard {...Unchecked.args} />
      <ReagentCard {...Unchecked.args} />
      <ReagentCard {...Unchecked.args} />
      <ReagentCard {...Unchecked.args} />
      <ReagentCard {...Unchecked.args} />
    </div>
    </SidebarLayout>
  )
}

export default Marketplace
