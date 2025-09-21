"use client"

import { useState, useEffect } from "react"
import MessageListBox from "./components/MessageListBox"
import ChatBox from "./components/ChatBox"
import Overlay from "../components/composite/Overlay"
import { getConversations } from "../services/inbox"
import { ConversationListResponseDto } from "../models/response-models/ChatRoomResponseDto"
import { onAuthStateChanged, User } from "firebase/auth"
import { auth } from "../config/firebase"

//            function: InboxPage           //
export default function InboxPage() {
  const [selectedConversation, setSelectedConversation] = useState<any>(null)
  const [conversations, setConversations] =
    useState<ConversationListResponseDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)

  //            effect: auth state change           //
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })
    return () => unsubscribe()
  }, [])

  //            function: loadConversations           //
  const loadConversations = async () => {
    if (!user?.uid) return

    try {
      setLoading(true)
      setError(null)
      const response = await getConversations(user.uid)
      console.log("conversations..")
      console.log(response)
      setConversations(response)
    } catch (err) {
      console.error("Error loading conversations:", err)
      setError("Failed to load conversations")
    } finally {
      setLoading(false)
    }
  }

  //            effect: load conversations on mount           //
  useEffect(() => {
    loadConversations()
  }, [user?.uid])

  //            function: handleConversationSelect           //
  const handleConversationSelect = (conversation: any) => {
    setSelectedConversation(conversation)
  }

  //            function: handleConversationUpdate           //
  const handleConversationUpdate = (updatedConversation: any) => {
    setSelectedConversation(updatedConversation)

    // Update the conversation in the conversations list
    if (conversations) {
      const updatedConversations = conversations.conversations.map((conv) =>
        conv.chat_room.id === updatedConversation.chat_room.id
          ? updatedConversation
          : conv,
      )
      setConversations({ conversations: updatedConversations })
    }
  }

  //            function: handleMessageSent           //
  const handleMessageSent = () => {
    // No need to reload all conversations since handleConversationUpdate handles it
    // This function is kept for compatibility but does nothing
  }

  //            render: InboxPage           //
  return (
    <Overlay>
      <div className="min-h-screen flex bg-background">
        <div className="flex w-full">
          {/* Left side - Message List */}
          <MessageListBox
            conversations={conversations}
            loading={loading}
            error={error}
            selectedConversation={selectedConversation}
            setSelectedConversation={handleConversationSelect}
            onRefresh={loadConversations}
          />
          {/* Right side - Chat Box */}
          <ChatBox
            selectedConversation={selectedConversation}
            onConversationUpdate={handleConversationUpdate}
          />
        </div>
      </div>
    </Overlay>
  )
}
