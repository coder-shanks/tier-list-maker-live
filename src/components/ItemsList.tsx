import { useDroppable } from "@dnd-kit/react"
import { DRAGGABLE_ITEMS } from "../lib/constants"
import DraggableItem from "./DraggableItem"

type ItemsListProps = {
  droppableItemIds: number[]
}

export default function ItemsList(props: ItemsListProps) {
  const { ref } = useDroppable({
    id: "POOL",
  })

  return (
    <section ref={ref} className="m-4 p-4 border-2 border-blue-300">
      Showing items here - this will be draggable area from which I will pick
      the items and place in the tier list area.
      <div className="flex gap-2 p-4">
        {props.droppableItemIds.map((droppableItemId) => {
          const foundItem = DRAGGABLE_ITEMS.find(
            (item) => item.id === droppableItemId,
          )
          return foundItem ? (
            <DraggableItem key={foundItem.id} item={foundItem} />
          ) : null
        })}
      </div>
    </section>
  )
}
