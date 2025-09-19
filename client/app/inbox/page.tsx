"use client"

import { useState } from "react"
import MessageListBox from "./components/MessageListBox"
import ChatBox from "./components/ChatBox"
import Overlay from "../components/composite/Overlay"

//            function: InboxPage           //
export default function InboxPage() {
  const [selectedConversation, setSelectedConversation] = useState<any>(null)

  //            render: InboxPage           //
  return (
    <Overlay>
      <div className="min-h-screen flex bg-background">
        <div className="flex w-full">
          {/* Left side - Message List */}
          <MessageListBox 
            selectedConversation={selectedConversation}
            setSelectedConversation={setSelectedConversation}
          />
          {/* Right side - Chat Box */}
          <ChatBox selectedConversation={selectedConversation} />
        </div>
      </div>
    </Overlay>
  )
}
