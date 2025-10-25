"use client"

import { MapPinIcon } from "@heroicons/react/24/outline"
import BaseCard from "../card/BaseCard"
import type { components } from "@/models/__generated__/schema"

type Reagent = components["schemas"]["Reagent"]
type ReagentWithId = Reagent & { id: string }

interface ReagentCardProps {
  reagent: ReagentWithId
  onEditClick?: () => void
  showEditButton?: boolean
}

const ReagentCard = ({
  reagent,
  onEditClick,
  showEditButton = false,
}: ReagentCardProps) => (
  <BaseCard
    {...reagent}
    reagentId={reagent.id}
    onViewClick={() => (window.location.href = `/marketplace/${reagent.id}`)}
    onEditClick={onEditClick}
    showEditButton={showEditButton}
    //location render
    footerLeft={
      <p className="underline-offset-2 text-white/50 flex text-xs gap-0.5">
        <MapPinIcon className="w-5 h-5" />
        <span className="truncate max-w-[5.5rem]">
          {reagent.location ?? "Unknown"}
        </span>
      </p>
    }
  />
)

export default ReagentCard
