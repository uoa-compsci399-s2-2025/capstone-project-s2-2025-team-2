import ReagentCard from "../components/composite/marketplace/ReagentCard"
import { DefaultReagentCard } from "../components/composite/marketplace/ReagentCard.story"
import SearchBar from "../components/composite/searchbar/SearchBar"
import Overlay from "../components/composite/sidebar/Overlay"

const Marketplace = () => {
  return (
    <Overlay>
      <SearchBar/>
      <div className="bg-white dark:bg-black flex flex-wrap pt-[2rem]">
        Marketplace
        <ReagentCard {...DefaultReagentCard.args} />
      </div>
    </Overlay>
  )
}

export default Marketplace
