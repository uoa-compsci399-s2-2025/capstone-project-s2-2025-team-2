import { FaFlask } from "react-icons/fa"
const ReduceWaste = () => {
  return (
    <div
      className="
            text-[#FF947A] font-bold flex items-center mt-[1.5rem]
            md:m-0 md:flex-col
        "
    >
      <div
        className="
                bg-[#FF947A]/[0.3] rounded-full p-4 inline-flex 
                lg:p-5
            "
      >
        <FaFlask size={40} className="text-[#FF947A] md:hidden" />
        <FaFlask size={40} className="text-[#FF947A] hidden md:block" />
      </div>

      <span
        className="
                tracking-wider text-[1.5rem] min-w-[15rem] pl-[1rem]
                md:m-0 md:p-0 md:mt-[1rem] md:text-[20px] md:text-center
            "
      >
        Reduce Waste
      </span>
    </div>
  )
}

export default ReduceWaste
