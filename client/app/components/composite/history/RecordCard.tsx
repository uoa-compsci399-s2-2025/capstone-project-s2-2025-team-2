"use client"

interface RecordCardProps {
  orderId: string
  name: string
  status: string
  createdAt: string
  offeredReagentId?: string
  price?: number
  quantity: number
  unit: number
}

const RecordCard = ({
  orderId,
  name,
  status,
  createdAt,
  offeredReagentId,
  price,
  quantity,
  unit,
}: RecordCardProps) => {
  const tradeType = price ? "Trade" : offeredReagentId ? "Exchange" : "Giveaway"
  const statusKey = String(status).toLowerCase()
  const statusClasses =
    statusKey === "pending"
      ? "bg-yellow-300 text-yellow-900"
      : statusKey === "approved"
        ? "bg-green-300"
        : statusKey === "canceled"
          ? "bg-red-300 text-red-900"
          : "bg-gray-300 text-gray-900"
  return (
    <div className="w-full border border-black px-4 py-2 rounded-2xl bg-primary/60">
      <div>
        <div className="md:flex md:justify-between items-center m-2">
          <h3 className="mb-4 md:m-0">{name}</h3>
          <div
            className={`px-2 py-0.5 ml-4 rounded-full text-center ${statusClasses}`}
          >
            <p>{status}</p>
          </div>
        </div>

        <div className="md:flex gap-4 m-2">
          <p className="text-gray-300">{tradeType}</p>
          <p className="text-gray-300">{name}</p>{" "}
          <p className="text-gray-300">{createdAt}</p>
        </div>
        <div className="w-full h-[1px] bg-white my-2"></div>
        <div className="m-2">
          <p>Order Id</p>
          <p className="">{orderId}</p>
        </div>
      </div>
    </div>
  )
}

export default RecordCard
