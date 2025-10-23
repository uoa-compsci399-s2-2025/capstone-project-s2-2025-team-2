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
    <div className="w-full border border-black p-2 rounded-md">
      <div>
        <h3>{name}</h3>
        <div>
          {status} {name} {createdAt}
        </div>
        <div>
          <p>Order Id</p>
          {orderId}
        </div>
      </div>
    </div>
  )
}

export default RecordCard
