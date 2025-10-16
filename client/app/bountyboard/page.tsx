import Overlay from "../components/composite/Overlay"

const BountyBoard = () => {
  return (
    <Overlay>
      <p className="text-4xl font-medium text-white mt-4 ml-4 md:ml-8 tracking-[0.05em]">
        Bounty Board
      </p>
      <div className="ml-4 md:ml-0">
        <p className="md:ml-8 text-warning italic font-bold inline mr-2 tracking-[0.05em]">
          Reagents Wanted
        </p>
        <p className="text-gray-100 italic inline">by Other Users</p>
      </div>
      <div className="mt-5"></div>
    </Overlay>
  )
}

export default BountyBoard