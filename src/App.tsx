import { DragDropProvider } from "@dnd-kit/react"
import { move } from "@dnd-kit/helpers"
import ItemsList from "./components/ItemsList"
import TierList from "./components/TierList"
import { useState } from "react"
import { INITIAL_STATE } from "./lib/constants"

function App() {
  const [containers, setContainers] = useState(INITIAL_STATE)

  return (
    <DragDropProvider
      onDragEnd={(event) => {
        setContainers((containers) => move(containers, event))
      }}
      // onDragEnd={(event) => {
      //   if (event.canceled) return
      //   // Item getting dragged
      //   const activeId = event.operation.source?.id as number

      //   // Drop zone item on which it is getting dropped
      //   const dropZoneId = event.operation.target?.id as number

      //   if (!activeId || !dropZoneId) return

      //   // 1. Find old container/tierRow which is holding my activeId
      //   const sourceContainer = Object.keys(containers).find((key) =>
      //     containers[key].includes(activeId),
      //   )

      //   // 2. Find target container
      //   const targetContainer = containers[dropZoneId]
      //     ? dropZoneId
      //     : Object.keys(containers).find((key) =>
      //         containers[key].includes(dropZoneId),
      //       )

      //   if (
      //     !sourceContainer ||
      //     !targetContainer ||
      //     sourceContainer === targetContainer
      //   )
      //     return

      //   // 3. Remove activeId from old container
      //   const newSourceList = containers[sourceContainer].filter(
      //     (id) => id !== activeId,
      //   )

      //   // 4. Add activeId to new container
      //   const newTargetList = [...containers[targetContainer], activeId]

      //   // 5. Update overall state
      //   setContainers({
      //     ...containers,
      //     [sourceContainer]: newSourceList,
      //     [targetContainer]: newTargetList,
      //   })
      // }}
    >
      <section>
        <TierList containers={containers} />
        <ItemsList droppableItemIds={containers["POOL"]} />
      </section>
    </DragDropProvider>
  )
}

export default App
