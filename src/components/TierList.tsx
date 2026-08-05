import { useDroppable } from "@dnd-kit/react"
import React from "react"
import { DRAGGABLE_ITEMS, TIERS } from "../lib/constants"
import type { Tier } from "../lib/types"
import DraggableItem from "./DraggableItem"

const MainContainer = (props: { children: React.ReactNode }) => {
  return <section className="m-4 p-4 bg-amber-100">{props.children}</section>
}

const TierTitle = (props: { title: string }) => {
  return <h2 className="font-bold p-2">{props.title}</h2>
}

const TierContainer = (props: { children: React.ReactNode }) => {
  return (
    <div className="grid grid-cols-[200px_1fr] border border-black max-w-4xl">
      {props.children}
    </div>
  )
}

const TierRow = (props: { tierDetails: Tier; draggedItemIds: number[] }) => {
  const { ref } = useDroppable({
    id: props.tierDetails.id,
  })

  return (
    <React.Fragment>
      <div
        className={`${props.tierDetails.bgColor} h-24 border border-black flex items-center justify-center`}
      >
        {props.tierDetails.title}
      </div>
      <div
        className="flex gap-2 p-2 items-center bg-white border border-black h-24"
        ref={ref}
      >
        {props.draggedItemIds.map((draggedItemId) => {
          const foundItem = DRAGGABLE_ITEMS.find(
            (item) => item.id === draggedItemId,
          )
          return foundItem ? (
            <DraggableItem key={draggedItemId} item={foundItem} />
          ) : null
        })}
      </div>
    </React.Fragment>
  )
}

type TierListProps = {
  containers: Record<string, number[]>
}

export default function TierList(props: TierListProps) {
  return (
    <MainContainer>
      <TierTitle title="Tier List Maker by Shubham on live stream" />
      <TierContainer>
        {TIERS.map((item: Tier) => (
          <TierRow
            key={item.id}
            tierDetails={item}
            draggedItemIds={props.containers[item.id]}
          />
        ))}
      </TierContainer>
    </MainContainer>
  )
}
