import { FaFlask } from "react-icons/fa"
const ReduceWaste = () => {
  return (
    <div
      className="
            text-[#FF947A] font-bold flex items-center mt-[4rem]
            lg:m-0 lg:flex-col lg:align-middle
        "
    >
      <div
        className="
                bg-[#FF947A]/[0.3] rounded-full p-4 inline-flex 
                lg:p-5
            "
      >
        <FaFlask size={40} className="text-[#FF947A] lg:hidden" />
        <FaFlask size={40} className="text-[#FF947A] hidden lg:block" />
      </div>

      <span
        className="
                tracking-wider text-[1.5rem] min-w-[15rem] pl-[1rem]
                lg:m-0 lg:p-0 lg:mt-[1rem] lg:text-[20px] lg:text-center
            "
      >
        Reduce Waste
      </span>
    </div>
  )
}

export default ReduceWaste
