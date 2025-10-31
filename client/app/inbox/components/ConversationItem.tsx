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
        {/* reagent, name, time */}
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
            <div className="flex flex-col items-start space-x-2 min-w-0">
              <h3 className="text-sm font-medium text-tint truncate max-w-[8.75rem] sm:max-w-[11rem]" title={conversation.name}>
                {conversation.name}
              </h3>
              <span className="inline-flex text-xs font-medium text-light-gray truncate max-w-[9.5rem] sm:max-w-[12rem]" title={conversation.reagent}>
                {conversation.reagent}
              </span>
            </div>
            <p className="text-xs text-secondary w-16 text-right flex-shrink-0">
              {conversation.time}
            </p>
          </div>
        </div>

        {/* conversation */}
        <div className="ml-13">
          <p className="text-sm text-light-gray truncate max-w-[15rem]">
            {conversation.lastMessage}
          </p>
        </div>
      </div>
    </div>
  )
}
