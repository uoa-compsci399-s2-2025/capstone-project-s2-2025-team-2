import Overlay from "@/app/components/composite/Overlay"
import client from "../services/fetch-client"
import { auth } from "@/app/config/firebase"
import { components } from "@/models/__generated__/schema"

type Order = components["schemas"]["Order"]

const fetchHistory = async () => {
  const response = await client.GET("/orders", {
    headers: {
      Authorization: `Bearer ${await auth.currentUser?.getIdToken()}`,
    },
  })
  return response.data as Order[]
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
