"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import MessageBubble from "../components/MessageBubble"
import { sendMessage, getChatRoomById } from "../../services/inbox"
import { onAuthStateChanged, User } from "firebase/auth"
import { auth } from "../../config/firebase"
import { formatTime } from "../../hooks/utils/timeFormatter"
import client from "../../services/fetch-client"
import { toast } from "sonner"
import { components } from "@/models/__generated__/schema"

type Reagent = components["schemas"]["Reagent"]
type ReagentWithId = Reagent & { id: string }

//            function: ChatBox           //
export default function ChatBox({
  selectedConversation,
  onConversationUpdate,
}: {
  selectedConversation: any
  onConversationUpdate: (updatedConversation: any) => void
}) {
  //            state           //
  const [messageInput, setMessageInput] = useState("")
  const [sending, setSending] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // edit reagent request state
  const [canEditRequest, setCanEditRequest] = useState(false)
  const [tradingType, setTradingType] = useState<
    "sell" | "trade" | "giveaway" | null
  >(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [requestPrice, setRequestPrice] = useState<string>("")
  const [requestingUserReagents, setRequestingUserReagents] = useState<
    ReagentWithId[]
  >([])
  const [offeredReagentId, setOfferedReagentId] = useState<string>("")
  const [requestSubmitting, setRequestSubmitting] = useState(false)
  const [editLoading, setEditLoading] = useState(false)

  //            effect: auth state change           //
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })
    return () => unsubscribe()
  }, [])

  // establish state for the reagent request
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("authToken")

      console.log("bruh2")
      console.log(selectedConversation)
      if (!selectedConversation?.chat_room || !user?.uid) return

      const reagentId = selectedConversation.chat_room.reagent_id
      const orderId = selectedConversation.chat_room.order_id
      setOrderId(orderId)
      console.log(selectedConversation.chat_room)
      try {
        setEditLoading(true)
        // fetch reagent data to get tradingType
        const { data: reagent } = await client.GET(
          `/reagents/${reagentId}` as any,
          {},
        )
        const type = reagent?.tradingType
        setTradingType(type)

        if (token && orderId) {
          const { data: order } = await client.GET(
            `/orders/${orderId}` as any,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          )

          const requesterId = order.requester_id
          // editing request can only be done on requesters side
          setCanEditRequest(requesterId === user.uid)

          if (order.price) {
            setRequestPrice(String(order.price))
          }
          if (order.offeredReagentId) {
            setOfferedReagentId(order.offeredReagentId)
          }
        } else {
          setCanEditRequest(false)
        }

        // for order of type trade, get requesting users reagents
        if (token && type === "trade") {
          const { data: reagents } = await client.GET(
            `/users/reagents` as any,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          )
          setRequestingUserReagents(reagents)
        }
      } catch (err) {
        console.error(`Failed to initialise request edit state: ${err}`)
      } finally {
        setEditLoading(false)
      }
    }
    init()
  }, [
    selectedConversation?.chat_room?.id,
    selectedConversation?.chat_room?.reagent_id,
    selectedConversation?.chat_room?.order_id,
  ])

  //            function: scrollToBottom           //
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  //            effect: scroll to bottom when messages change           //
  useEffect(() => {
    scrollToBottom()
  }, [selectedConversation?.messages])

  //            function: transformMessage           //
  const transformMessage = (message: any, isUser: boolean) => ({
    id: message.id,
    sender: isUser ? "user" : "other",
    content: message.content,
    timestamp: formatTime(message.created_at, "time"),
  })

  //            function: handleSendMessage           //
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation || !user?.uid || sending)
      return

    try {
      setSending(true)
      await sendMessage({
        chat_room_id: selectedConversation.chat_room.id,
        sender_id: user.uid,
        content: messageInput.trim(),
      })

      setMessageInput("")

      // Refresh the current conversation with latest messages
      const updatedConversation = await getChatRoomById(
        selectedConversation.chat_room.id,
        user.uid,
      )
      onConversationUpdate(updatedConversation)
    } catch (error) {
      console.error("Error sending message:", error)
      // You could add a toast notification here
    } finally {
      setSending(false)
    }
  }

  //            function: handleKeyPress           //
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  //            function: getMessages           //
  const getMessages = () => {
    if (!selectedConversation?.messages) return []

    // Messages are already sorted by server (oldest first)
    return selectedConversation.messages.map((message: any) =>
      transformMessage(message, message.sender_id === user?.uid),
    )
  }

  const cancelOrder = async () => {
    if (!orderId) return
    const token = localStorage.getItem("authToken")
    if (!token) return
    try {
      setRequestSubmitting(true)
      const { error } = await client.PATCH(`/orders/${orderId}/cancel` as any, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (error) {
        console.error(`Error cancelling order: ${error}`)
        throw new Error(`Error cancelling order: ${error}`)
      }
      toast("Order request deleted")
      // refresh conversation
      const updatedConvo = await getChatRoomById(
        selectedConversation.chat_room.id,
        user!.uid,
      )
      onConversationUpdate(updatedConvo)
    } catch (err) {
      console.error(`Error cancelling order: ${err}`)
      toast("Failed to delete order request")
    } finally {
      setRequestSubmitting(false)
    }
  }

  const updateOrder = async () => {
    if (!orderId || !selectedConversation?.chat_room?.reagent_id) return
    const token = localStorage.getItem("authToken")
    if (!token) return
    try {
      setRequestSubmitting(true)
      // update order
      const body: any =
        tradingType === "sell"
          ? { price: Number(requestPrice) }
          : { offeredReagentId }

      const { error } = await client.PATCH(`/orders/${orderId}` as any, {
        body,
        headers: { Authorization: `Bearer ${token}` },
      })
      if (error) {
        console.error(`Failed to update request: ${error}`)
        throw new Error(`Failed to update request: ${error}`)
      }

      toast("Request updated")
      setIsEditOpen(false)
      // refresh convo
      const updated = await getChatRoomById(
        selectedConversation.chat_room.id,
        user!.uid,
      )
      onConversationUpdate(updated)
    } catch (err) {
      toast("Failed to update request")
      console.error(`Failed to update request: ${err}`)
      throw new Error(`Failed to update request: ${err}`)
    } finally {
      setRequestSubmitting(false)
    }
  }

  //            render: ChatBox           //
  if (!selectedConversation) {
    return (
      <div className="h-[calc(100vh-4rem)] md:h-[calc(100vh-2rem)]  flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-secondary mb-2">
            Select a conversation
          </h2>
          <p className="text-gray">
            Choose a conversation from the list to start messaging
          </p>
        </div>
      </div>
    )
  }

  const messages = getMessages()

  return (
    <div className="h-[calc(100vh-4rem)] md:h-[calc(100vh-2rem)] w-full flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-[var(--gray-100)] bg-background md:w-full">
        <div className="md:flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src="/placeholder.webp"
              alt={selectedConversation.other_user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h2 className="text-lg font-semibold text-tint">
                {selectedConversation.other_user.name}
              </h2>
              <p className="text-sm text-secondary">
                {selectedConversation.other_user.email}
              </p>
            </div>
          </div>

          <div className="flex space-x-2 md:m-0 mt-4">
            {/* edit request form btn */}
            {canEditRequest && tradingType && tradingType !== "giveaway" && (
              <button
                onClick={() => setIsEditOpen(true)}
                disabled={editLoading}
                className="p-2 text-xs md:text-sm bg-[var(--dark-gray)] text-white hover:bg-[var(--dark-gray)]/70 cursor-pointer rounded-2xl transition-colors disabled:opacity-50"
              >
                Edit Request
              </button>
            )}
            {/* 'edit request' btn becomes 'cancel request' if reagent listing of type 'giveaway' */}
            {canEditRequest && tradingType === "giveaway" && (
              <button
                onClick={cancelOrder}
                disabled={requestSubmitting || editLoading}
                className="md:px-4 md:py-2 p-2 text-xs md:text-sm bg-red-600 text-white hover:bg-red-700 cursor-pointer rounded-2xl transition-colors disabled:opacity-50"
              >
                Delete Request
              </button>
            )}
            <button
              onClick={() => {
                if (selectedConversation.chat_room.reagent_id) {
                  router.push(
                    `/marketplace/${selectedConversation.chat_room.reagent_id}`,
                  )
                }
              }}
              className="md:px-4 md:py-2 p-2 text-xs md:text-sm bg-[var(--dark-gray)] text-white hover:bg-[var(--dark-gray)]/70 cursor-pointer rounded-2xl transition-colors"
            >
              View Listing
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-secondary mb-2">No messages yet</p>
              <p className="text-sm text-gray-500">Start the conversation!</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message: any) => (
              <MessageBubble
                key={message.id}
                message={message}
                isUser={message.sender === "user"}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-[var(--gray-100)] bg-background">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Message..."
            disabled={sending}
            className="flex-1 px-4 py-2 bg-primary text-tint placeholder-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
          <button
            onClick={handleSendMessage}
            disabled={sending || !messageInput.trim()}
            className="bg-primary p-2 text-[var(--color-blue-primary)] hover:text-[var(--color-blue-secondary)] transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            ) : (
              <svg
                className="w-6 h-6 transform rotate-90"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* edit req form */}
      {isEditOpen &&
        canEditRequest &&
        tradingType &&
        tradingType !== "giveaway" && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsEditOpen(false)
            }}
          >
            <div className="relative w-full bg-primary/80 rounded-2xl p-6">
              <h2 className="text-2xl font-medium text-white">
                Edit Reagent Request
              </h2>

              {/* for listings of type 'sell', requesting user can change sell price offered */}
              {tradingType === "sell" && (
                <div>
                  <label className="block text-sm font-medium text-white">
                    Reagent Price
                  </label>
                  <input
                    type="number"
                    value={requestPrice}
                    onChange={(e) => setRequestPrice(e.target.value)}
                    placeholder="0"
                    disabled={requestSubmitting}
                    className="w-full px-3 py-2 border rounded-lg bg-primary/50 text-white"
                  />
                </div>
              )}

              {/* for listings of type 'trade', requesting user can change reagent offered from a list of other reagents they own */}
              {tradingType === "trade" && (
                <div>
                  <label className="block text-sm font-medium text-white">
                    Reagent to Trade
                  </label>
                  <select
                    value={offeredReagentId}
                    onChange={(e) => setOfferedReagentId(e.target.value)}
                    disabled={requestSubmitting}
                    className="w-full px-3 py-2 border rounded-lg bg-primary/50 text-white"
                  >
                    {requestingUserReagents.map((reagent) => (
                      <option
                        key={reagent.id}
                        value={reagent.id}
                        className="bg-primary"
                      >
                        {reagent.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-between pt-6 mt-6">
                <button
                  onClick={() => setIsEditOpen(false)}
                  disabled={requestSubmitting}
                  className="px-4 py-2 text-white rounded-lg bg-gray-600 hover:bg-red-500 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={updateOrder}
                  disabled={requestSubmitting}
                  className="px-4 py-2 text-white rounded-lg bg-blue-primary hover:bg-blue-primary/80 disabled:opacity-50"
                >
                  Update Request
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}
