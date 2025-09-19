"use client"

//            function: ConversationItem           //
export default function ConversationItem({
  conversation,
  isSelected,
  onClick,
}: {
  conversation: {
    id: number
    name: string
    university?: string
    lastMessage: string
    time: string
    reagent: string
    isActive: boolean
    avatar: string
  }
  isSelected: boolean
  onClick: () => void
}) {
  //            render: ConversationItem           //
  return (
    <div
      className={`p-3 cursor-pointer hover:bg-primary transition-colors ${
        isSelected ? "bg-primary" : ""
      }`}
      onClick={onClick}
    >
      <div className="">
        {/* 위쪽: 이미지, 이름, reagent */}
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <img
              src={conversation.avatar}
              alt={conversation.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>

          {/* 이름과 reagent */}
          <div className="flex-1 min-w-0 flex items-start justify-between">
            <div className="flex flex-col items-start space-x-2">
              <h3 className="text-sm font-medium text-tint truncate">
                {conversation.name}
              </h3>
              <span className="inline-flex text-xs font-medium text-light-gray">
                {conversation.reagent}
              </span>
            </div>
            <p className="text-xs text-secondary">{conversation.time}</p>
          </div>
        </div>

        {/* 아래쪽: conversation */}
        <div className="ml-13">
          <p className="text-sm text-light-gray truncate">
            {conversation.lastMessage}
          </p>
        </div>
      </div>
    </div>
  )
}
