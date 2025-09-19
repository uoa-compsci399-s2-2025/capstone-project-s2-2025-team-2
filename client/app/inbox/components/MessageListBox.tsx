"use client"

import { useState } from "react"
// import SearchBar from "../../components/composite/searchbar/SearchBar"
import ConversationItem from "./ConversationItem"

//            function: MessageListBox           //
export default function MessageListBox({
  selectedConversation,
  setSelectedConversation,
}: {
  selectedConversation: any
  setSelectedConversation: (conversation: any) => void
}) {
  //            state           //
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data for conversations
  const conversations = [
    {
      id: 1,
      name: "Violet Chen",
      university: "Victoria University of Wellington",
      lastMessage: "lmao broke",
      time: "12m ago",
      reagent: "Sulfuric Acid",
      isActive: true,
      avatar: "/placeholder.webp"
    },
    {
      id: 2,
      name: "Logan Belling...",
      lastMessage: "Stop lowballing me",
      time: "5m ago",
      reagent: "Salt",
      isActive: false,
      avatar: "/placeholder.webp"
    },
    {
      id: 3,
      name: "Del Huang",
      lastMessage: "Should arrive next week",
      time: "2hr ago",
      reagent: "Phenol",
      isActive: false,
      avatar: "/placeholder.webp"
    },
    {
      id: 4,
      name: "Ray Zhao",
      lastMessage: "Ok great",
      time: "8hr ago",
      reagent: "Hydrochloric Acid",
      isActive: false,
      avatar: "/placeholder.webp"
    },
    {
      id: 5,
      name: "Ezekiel Ko",
      lastMessage: "Sure!",
      time: "11hr ago",
      reagent: "Ethanol",
      isActive: false,
      avatar: "/placeholder.webp"
    },
    {
      id: 6,
      name: "Kihyun Kim",
      lastMessage: "That sounds great!",
      time: "14hr ago",
      reagent: "Hydrogen Peroxide",
      isActive: false,
      avatar: "/placeholder.webp"
    },
    {
      id: 7,
      name: "David Broder..",
      lastMessage: "Tuesday could work",
      time: "1d ago",
      reagent: "Osmium Tetroxide",
      isActive: false,
      avatar: "/placeholder.webp"
    },
    {
      id: 8,
      name: "Wandia Kimita",
      lastMessage: "What if I traded you for..",
      time: "Tuesday",
      reagent: "Sulfuric Acid",
      isActive: false,
      avatar: "/placeholder.webp"
    },
    {
      id: 9,
      name: "Anna Trofimo..",
      lastMessage: "I'll check with our lab m..",
      time: "30/8",
      reagent: "Acetone",
      isActive: false,
      avatar: "/placeholder.webp"
    }
  ]

  //            function: handleConversationSelect           //
  const handleConversationSelect = (conversation: any) => {
    setSelectedConversation(conversation)
  }

  //            function: handleSearchChange           //
  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  //            render: MessageListBox           //
  return (
    <div className="w-1/4 bg-background flex flex-col h-screen">
      {/* Header */}
      <div className="p-4">
        <h1 className="text-xl font-semibold text-tint mb-4">Messages</h1>
        
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
            <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-2">
            <button className="text-secondary hover:text-light-gray">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
            <button className="text-secondary hover:text-light-gray">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            isSelected={selectedConversation?.id === conversation.id}
            onClick={() => handleConversationSelect(conversation)}
          />
        ))}
      </div>
    </div>
  )
}
