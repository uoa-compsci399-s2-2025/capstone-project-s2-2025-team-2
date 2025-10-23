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
  return (
    <div className="w-full border border-black px-4 py-2 rounded-2xl bg-secondary/30">
      <div>
        <div className="md:flex justify-between items-center">
          <h3>{name}</h3>
          <div>button</div>
        </div>

        <div className="md:flex gap-4">
          <p className="opacity-70">{status}</p>
          <p className="opacity-70">{name}</p>{" "}
          <p className="opacity-70">{createdAt}</p>
        </div>
        <div className="w-full h-[1px] bg-white my-2"></div>
        <div>
          <p>Order Id</p>
          <p className="">{orderId}</p>
        </div>
      </div>
    </div>
  )
}

export default RecordCard
