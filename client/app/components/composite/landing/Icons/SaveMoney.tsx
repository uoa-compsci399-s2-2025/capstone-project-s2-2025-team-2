import { FaMoneyBills } from "react-icons/fa6"
const SaveMoney = () => {
  return (
    <div
      className="
            text-[#3CD856] font-bold flex items-center mt-[1.5rem]
            lg:m-0 lg:flex-col
        "
    >
      <div
        className="
                bg-[#3CD856]/[0.3] rounded-full p-4 inline-flex
                lg:p-5
            "
      >
        <FaMoneyBills size={40} className="text-[#3CD856] lg:hidden" />
        <FaMoneyBills size={40} className="text-[#3CD856] hidden lg:block" />
      </div>

      <span
        className="
                tracking-wider text-[1.5rem] min-w-[15rem] pl-[1rem]
                lg:m-0 lg:p-0 lg:mt-[1rem] lg:text-[20px] lg:text-center
            "
      >
        Save Money
      </span>
    </div>
  )
}

export default SaveMoney
