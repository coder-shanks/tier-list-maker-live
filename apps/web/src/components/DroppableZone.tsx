import { useDroppable } from '@dnd-kit/react'

type DroppableZoneProps = {
  id: string
  children: React.ReactNode
}

export default function DroppableZone(props: DroppableZoneProps) {
  const { ref } = useDroppable({
    id: props.id,
  })

  return (
    <div
      ref={ref}
      className={`flex items-center justify-center h-60 w-80 border-2 border-dashed border-indigo-200 rounded-xl`}
    >
      {props.children}
    </div>
  )
}
