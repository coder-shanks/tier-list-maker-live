import { useDraggable } from "@dnd-kit/react"
import { Button } from "./ui/button"
import type { DragItem } from "../lib/types"

export default function DraggableItem(props: { item: DragItem }) {
  const { ref } = useDraggable({
    id: props.item.id,
  })

  return (
    <Button
      key={props.item.id}
      ref={ref}
      className="flex h-16 w-16 items-center justify-center"
    >
      {props.item.content}
    </Button>
  )
}
