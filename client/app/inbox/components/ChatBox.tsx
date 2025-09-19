"use client"

import { useState } from "react"
import MessageBubble from "../components/MessageBubble"

//            function: ChatBox           //
export default function ChatBox({
  selectedConversation,
}: {
  selectedConversation: any
}) {
  //            state           //
  const [messageInput, setMessageInput] = useState("")

  // Mock messages data
  const messages = [
    {
      id: 1,
      sender: "user",
      content: "Hey Violet, I see you have industrial-grade sulfuric acid available. I would love to purchase 24 x 1L tanks, what would you have in mind for pricing?",
      timestamp: "12:30 PM"
    },
    {
      id: 2,
      sender: "violet",
      content: "Hello! I can happily arrange those 1L containers for you. For an order of 24 x 1L tanks, you'd be looking at around $26 per liter.",
      timestamp: "12:32 PM"
    },
    {
      id: 3,
      sender: "violet",
      content: "The pricing is due to handling and packaging requirements. Smaller packaged volumes like this are shipped as hazardous goods, and have additional costs.",
      timestamp: "12:33 PM"
    },
    {
      id: 4,
      sender: "violet",
      content: "Shipping would be extra on top of that. Would you like me see how much it would be to ship directly to your university?",
      timestamp: "12:34 PM"
    },
    {
      id: 5,
      sender: "user",
      content: "Ah, that might be a little out of our lab budget unfortunately.",
      timestamp: "12:35 PM"
    },
    {
      id: 6,
      sender: "violet",
      content: "lmao broke",
      timestamp: "12:36 PM"
    }
  ]

  //            function: handleSendMessage           //
  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Handle sending message
      console.log("Sending message:", messageInput)
      setMessageInput("")
    }
  }

  //            function: handleKeyPress           //
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  //            render: ChatBox           //
  if (!selectedConversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-secondary mb-2">Select a conversation</h2>
          <p className="text-gray">Choose a conversation from the list to start messaging</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-[var(--gray-100)] bg-background">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={selectedConversation.avatar}
              alt={selectedConversation.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h2 className="text-lg font-semibold text-tint">
                {selectedConversation.name}
              </h2>
              <p className="text-sm text-secondary">
                {selectedConversation.university}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button className="px-4 py-2 text-sm bg-[var(--dark-gray)] text-white text-light-gray hover:bg-primary rounded-2xl transition-colors">
              View Listing
            </button>
            <button className="px-4 py-2 text-sm bg-[var(--dark-gray)] text-white text-light-gray hover:bg-primary rounded-2xl transition-colors">
              Edit Request
            </button>
            <button className="px-4 py-2 text-sm bg-[var(--succ-green-light)] hover:bg-green-700 text-white rounded-2xl transition-colors">
              Confirm Trade
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isUser={message.sender === "user"}
          />
        ))}
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
            className="flex-1 px-4 py-2 bg-primary text-tint placeholder-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            className="bg-primary p-2 text-[var(--color-blue-primary)] hover:text-[var(--color-blue-secondary)] transition-colors rounded-lg"
          >
            <svg className="w-6 h-6 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
