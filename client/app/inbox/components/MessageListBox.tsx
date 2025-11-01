"use client"

import { useState, useMemo } from "react"
// import SearchBar from "../../components/composite/searchbar/SearchBar"
import ConversationItem from "./ConversationItem"
import { ConversationListResponseDto } from "../../models/response-models/ChatRoomResponseDto"
import { formatTime } from "../../hooks/utils/timeFormatter"
import LoadingState from "@/app/components/composite/loadingstate/LoadingState"

//            function: MessageListBox           //
export default function MessageListBox({
  conversations,
  loading,
  error,
  selectedConversation,
  setSelectedConversation,
  onRefresh,
}: {
  conversations: ConversationListResponseDto | null
  loading: boolean
  error: string | null
  selectedConversation: any
  setSelectedConversation: (conversation: any) => void
  onRefresh: () => void
}) {
  //            state           //
  const [searchQuery, setSearchQuery] = useState("")

  //            function: getLastMessage           //
  const getLastMessage = (messages: any[]) => {
    console.log("messages..")
    console.log(messages)
    if (!messages || messages.length === 0) return "No messages yet"
    return messages[messages.length - 1]?.content || "No messages yet"
  }

  //            function: transformConversation           //
  const transformConversation = (conversation: any) => ({
    id: conversation.chat_room.id,
    name: conversation.other_user.name,
    university: conversation.other_user.email,
    lastMessage: getLastMessage(conversation.messages),
    time:
      conversation.messages.length > 0
        ? formatTime(
            conversation.messages[conversation.messages.length - 1].created_at,
          )
        : "No messages",
    reagent: conversation.reagent_name || "Reagent",
    isActive: selectedConversation?.id === conversation.chat_room.id,
    avatar: "/placeholder.webp",
    originalData: conversation,
  })

  //            function: handleConversationSelect           //
  const handleConversationSelect = (conversation: any) => {
    setSelectedConversation(conversation.originalData)
  }

  //            function: handleSearchChange           //
  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  //            function: filteredConversations           //
  const filteredConversations = useMemo(() => {
    if (!conversations?.conversations) return []

    const transformed = conversations.conversations.map(transformConversation)

    //sort messages by recency (most recent first)
    const sorted = transformed.sort((a, b) => {
      const getTime = (conv: any) => {
        //format firebase timestamp
        const lastMsg = conv.originalData?.messages?.slice(-1)[0]
        return lastMsg?.created_at?._seconds
          ? lastMsg.created_at._seconds * 1000
          : 0
      }
      return getTime(b) - getTime(a)
    })

    if (!searchQuery) return sorted

    return sorted.filter(
      (conv) =>
        conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [conversations, searchQuery, selectedConversation])

  //            function: handleRefresh           //
  const handleRefresh = () => {
    onRefresh()
  }

  //            render: MessageListBox           //
  return (
    <div className="w-full bg-background flex flex-col h-[calc(100vh-4rem)] lg:h-[calc(100vh-2rem)]">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-tint">Messages</h1>
          <button
            onClick={handleRefresh}
            className="text-secondary hover:text-light-gray transition-colors"
            disabled={loading}
          >
            <svg
              className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full px-4 py-2 pl-10 pr-20 bg-primary text-tint placeholder-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <svg
              className="w-5 h-5 text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && <LoadingState pageName="Conversations" />}

      {/* Error State */}
      {error && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-2">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredConversations.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-secondary mb-2">No conversations found</p>
            <p className="text-sm text-gray-500">
              {searchQuery
                ? "Try adjusting your search"
                : "Start a conversation by creating a request"}
            </p>
          </div>
        </div>
      )}

      {/* Conversations List */}
      {!loading && !error && filteredConversations.length > 0 && (
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {filteredConversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isSelected={
                selectedConversation?.chat_room?.id === conversation.id
              }
              onClick={() => handleConversationSelect(conversation)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
