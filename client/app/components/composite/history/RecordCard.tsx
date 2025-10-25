"use client"

interface RecordCardProps {
  orderId: string
  ownerName: string
  requesterName: string
  reagentId: string
  reagentName?: string
  status: string
  createdAt: string
  offeredReagentId?: string
  price?: number
}

const RecordCard = ({
  orderId,
  requesterName,
  ownerName,
  reagentId,
  reagentName,
  status,
  createdAt,
  offeredReagentId,
  price,
}: RecordCardProps) => {
  const tradeType = price ? "Trade" : offeredReagentId ? "Exchange" : "Giveaway"
  const statusKey = String(status).toLowerCase()
  const ownerKey = String(ownerName).toLowerCase()
  const reqKey = String(requesterName).toLowerCase()
  const ownerClasses = ownerKey === "unknown owner" ? "text-red-500" : ""
  const reqClasses = reqKey === "unknown requester" ? "text-red-500" : ""
  const statusClasses =
    statusKey === "pending"
      ? "bg-yellow-700"
      : statusKey === "approved"
        ? "bg-gradient-to-r from-green-300 to-green-900"
        : statusKey === "canceled"
          ? "bg-gradient-to-r from-red-500 to-red-900"
          : "bg-gradient-to-r from-gray-300 to-gray-900"
  return (
    <div className="w-full border-2 border-secondary/20 px-4 py-1 rounded-2xl bg-primary/70 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div>
        <div className="md:flex justify-between items-center m-2">
          <h3 className="md:mr-10 text-lg md:text-xl">{reagentName}</h3>
          <div
            className={`shadow-xl mt-4 hidden md:block md:m-0 px-3 py-0.5 ml-4 rounded-full text-center ${statusClasses}`}
          >
            <p className="text-sm">{status}</p>
          </div>
          <div
            className={`shadow-xl w-24 md:hidden block my-2 md:m-0 px-3 py-0.5 rounded-full text-center ${statusClasses}`}
          >
            <p className="text-sm">{status}</p>
          </div>
        </div>

        <div className="md:flex gap-4 m-2">
          <p className="text-gray-300 text-sm">Order Type: {tradeType}</p>
          {price && <p className="text-gray-300 text-sm">Price: ${price}</p>}
          {offeredReagentId && (
            <p className="text-gray-300 text-sm">
              Offered Reagent ID: {offeredReagentId}
            </p>
          )}
          <span className="flex gap-2">
            <p className="text-gray-300 text-sm">Owner: </p>
            <p className={`text-gray-300 text-sm ${ownerClasses}`}>
              {ownerName}
            </p>
          </span>

          <p className="text-gray-300 text-sm">Date: {createdAt}</p>
          <p className={`text-gray-300 text-sm ${reqClasses}`}>
            {requesterName}
          </p>
        </div>
        <div className="w-full h-[1px] bg-white/40 my-3"></div>
        <div className="m-2">
          <p>Reagent Id</p>
          <p className="text-gray-400">{reagentId}</p>
        </div>
      </div>
    </div>
  )
}

export default RecordCard
