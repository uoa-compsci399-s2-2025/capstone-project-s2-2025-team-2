"use client"

import { useState, useEffect } from "react"
import MessageListBox from "./components/MessageListBox"
import ChatBox from "./components/ChatBox"
import Overlay from "../components/composite/Overlay"
import { getConversations } from "../services/inbox"
import { ConversationListResponseDto } from "../models/response-models/ChatRoomResponseDto"
import { onAuthStateChanged, User } from "firebase/auth"
import { auth } from "../config/firebase"
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline"

//            function: InboxPage           //
export default function InboxPage() {
  const [selectedConversation, setSelectedConversation] = useState<any>(null)
  const [conversations, setConversations] =
    useState<ConversationListResponseDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [menuAnim, setMenuAnim] = useState("-translate-x-full")
  //            effect: auth state change           //
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (isMenuOpen) {
      setIsVisible(true)
      setMenuAnim("-translate-x-full")
      setTimeout(() => setMenuAnim("translate-x-0"), 10)
    } else {
      setMenuAnim("-translate-x-full")
      const timer = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isMenuOpen])

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

  //            render: InboxPage           //
  return (
    <Overlay>
      <div className="min-h-[calc(100vh-4rem)] flex bg-background">
        <div className="flex w-full">
          <button
            className="md:hidden fixed right-0 mr-3 mt-[1rem] hover:text-grey duration-300 text-white cursor-pointer px-3 py-2 flex items-center gap-1 border rounded-lg"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <ChevronLeftIcon className="h-3.5 w-3.5 text-white"></ChevronLeftIcon>
            inbox
          </button>
          {/* Left side - Message List */}{" "}
          <div className="md:block hidden">
            {" "}
            <MessageListBox
              conversations={conversations}
              loading={loading}
              error={error}
              selectedConversation={selectedConversation}
              setSelectedConversation={handleConversationSelect}
              onRefresh={loadConversations}
            />
          </div>
          {isVisible && (
            <div className="fixed inset-0 bg-black/60 z-50 flex">
              <div
                className={`
                w-4/5 max-w-xs h-full shadow-2xl bg-background
                transition-transform duration-300
                ${menuAnim}
                absolute left-0 top-0
              `}
                style={{ willChange: "transform" }}
              >
                <MessageListBox
                  conversations={conversations}
                  loading={loading}
                  error={error}
                  selectedConversation={selectedConversation}
                  setSelectedConversation={handleConversationSelect}
                  onRefresh={loadConversations}
                />
              </div>
              <div className="flex-1" onClick={() => setIsMenuOpen(false)} />
            </div>
          )}
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
