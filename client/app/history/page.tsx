import Overlay from "@/app/components/composite/Overlay"
import client from "../services/fetch-client"

const fetchHistory = async () => {
  const { data } = await client.GET("/orders")
  return data
}

const History = () => {
  const data = fetchHistory()
  return (
    <Overlay>
      <div></div>
    </Overlay>
  )
}

export default History
