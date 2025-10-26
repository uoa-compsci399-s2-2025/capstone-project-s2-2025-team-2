"use client"

import { useState, useEffect, useRef } from "react"
import MessageBubble from "../components/MessageBubble"
import { sendMessage, getChatRoomById, getMessages } from "../../services/inbox"
import { onAuthStateChanged, User } from "firebase/auth"
import { auth } from "../../config/firebase"
import { formatTime } from "../../hooks/utils/timeFormatter"

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
  const [isResponser, setIsResponser] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [loadingMessages, setLoadingMessages] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  //            effect: auth state change           //
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })
    return () => unsubscribe()
  }, [])

  //            function: scrollToBottom           //
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  //            effect: load messages when conversation changes           //
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedConversation?.chat_room?.id) return

      setLoadingMessages(true)
      try {
        const response = await getMessages(selectedConversation.chat_room.id)
        setMessages(response.messages)
      } catch (error) {
        console.error("Error loading messages:", error)
      } finally {
        setLoadingMessages(false)
      }
    }

    loadMessages()
  }, [selectedConversation?.chat_room?.id])

  //            effect: scroll to bottom when messages change           //
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  //            effect: check if user is responder           //
  useEffect(() => {
    if (user?.uid && selectedConversation?.chat_room?.user2_id) {
      if (user.uid === selectedConversation.chat_room.user2_id) {
        setIsResponser(true)
      } else {
        setIsResponser(false)
      }
    } else {
      setIsResponser(false)
    }
  }, [user?.uid, selectedConversation?.chat_room?.user2_id])

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

      // Refresh messages after sending
      const response = await getMessages(selectedConversation.chat_room.id)
      setMessages(response.messages)

      // Update conversation to refresh last message
      const updatedConversation = await getChatRoomById(
        selectedConversation.chat_room.id,
        user.uid,
      )
      onConversationUpdate(updatedConversation)
    } catch (error) {
      console.error("Error sending message:", error)
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

  //            function: getTransformedMessages           //
  const getTransformedMessages = () => {
    return messages.map((message: any) =>
      transformMessage(message, message.sender_id === user?.uid),
    )
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

  const transformedMessages = getTransformedMessages()

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
            <button className="md:px-4 md:py-2 p-2 text-xs md:text-sm bg-[var(--dark-gray)] text-white hover:bg-[var(--dark-gray)]/70 cursor-pointer rounded-2xl transition-colors">
              View Listing
            </button>
            {!isResponser && (
              <button className="md:px-4 md:py-2 p-2 text-xs md:text-sm bg-[var(--dark-gray)] text-white hover:bg-[var(--dark-gray)]/70 cursor-pointer rounded-2xl transition-colors">
                Edit Request
              </button>
            )}
            {isResponser && (
              <button className="md:px-4 md:py-2 p-2 text-xs md:text-sm bg-[var(--succ-green-light)] hover:bg-green-700 text-white rounded-2xl transition-colors">
                Confirm Trade
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {loadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-secondary">Loading messages...</p>
            </div>
          </div>
        ) : transformedMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-secondary mb-2">No messages yet</p>
              <p className="text-sm text-gray-500">Start the conversation!</p>
            </div>
          </div>
        ) : (
          <>
            {transformedMessages.map((message: any) => (
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
    </div>
  )
}
