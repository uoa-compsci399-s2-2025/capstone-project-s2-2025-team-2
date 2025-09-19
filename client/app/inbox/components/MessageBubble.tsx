"use client"

//            function: MessageBubble           //
export default function MessageBubble({
  message,
  isUser,
}: {
  message: {
    id: number
    sender: string
    content: string
    timestamp: string
  }
  isUser: boolean
}) {
  //            render: MessageBubble           //
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl ${
          isUser
            ? "bg-[var(--color-purple)] text-white"
            : "bg-gray-700 text-gray-100"
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <p
          className={`text-xs mt-1 text-gray-400`}
        >
          {message.timestamp}
        </p>
      </div>
    </div>
  )
}
