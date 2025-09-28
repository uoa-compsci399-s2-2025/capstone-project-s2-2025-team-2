"use client"

import { MapPinIcon } from "@heroicons/react/24/outline"
import BaseCard from "../card/BaseCard"
import type { components } from "@/models/__generated__/schema"

type Reagent = components["schemas"]["Reagent"]
type ReagentWithId = Reagent & { id: string }

interface ReagentCardProps {
  reagent: ReagentWithId
}

const ReagentCard = ({ reagent }: ReagentCardProps) => (
  <BaseCard
    {...reagent}
    reagentId={reagent.id}
    //location render
    footerLeft={
      <p className="underline-offset-2 text-white/50 flex text-xs gap-0.5">
        <MapPinIcon className="w-5 h-5" />
        <span className="truncate max-w-[135px]">{reagent.location ?? "Unknown"}</span>
      </p>
    }
  />
)

export default ReagentCard
