import { useCallback, useMemo, useEffect } from 'react'
import {
  DragDropProvider,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/react'
import { move } from '@dnd-kit/helpers'
import { useUiStore } from '../../store/useUiStore'
import { useTierDataStore } from '../../store/useTierDataStore'
import { useMetadataStore } from '../../store/useMetadataStore'
import { useBlindStore } from '../../store/useBlindStore'
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts'
import Navbar from '../Navbar'
import TierList from '../TierList'
import ItemsList from '../ItemsList'
import FloatingStudioDock from '../FloatingStudioDock'
import AddItemModal from '../AddItemModal'
import ExportModal from '../ExportModal'
import TemplateSelectorModal from '../TemplateSelectorModal'
import RandomPickerModal from '../RandomPickerModal'
import BlindChallengeSetupModal from '../BlindChallengeSetupModal'
import BlindChallengeSummaryModal from '../BlindChallengeSummaryModal'
import FullscreenView from '../FullscreenView'
import DraggableItem from '../DraggableItem'
import Footer from '../Footer'

interface TierStudioProps {
  initialTemplateId?: string
}

export default function TierStudio({ initialTemplateId }: TierStudioProps) {
  const theme = useUiStore((s) => s.theme)
  const previewMode = useUiStore((s) => s.previewMode)
  const activeDragId = useUiStore((s) => s.activeDragId)
  const setActiveDragId = useUiStore((s) => s.setActiveDragId)

  const items = useTierDataStore((s) => s.items)
  const setContainers = useTierDataStore((s) => s.setContainers)
  const loadTemplate = useTierDataStore((s) => s.loadTemplate)
  const selectedTemplateId = useMetadataStore((s) => s.selectedTemplateId)

  // If initialTemplateId is provided and differs from currently selected, load it
  useEffect(() => {
    if (initialTemplateId && initialTemplateId !== selectedTemplateId) {
      loadTemplate(initialTemplateId)
    }
  }, [initialTemplateId, selectedTemplateId, loadTemplate])

  // Attach global keyboard shortcuts hook
  useKeyboardShortcuts()

  // Active dragged item calculation memoized
  const activeItem = useMemo(
    () => items.find((it) => it.id === activeDragId),
    [items, activeDragId],
  )

  // Background style class
  const pageBgClass = theme === 'dark' ? 'studio-grid-dark' : 'studio-grid-light'

  // DnD callbacks memoized with @dnd-kit/helpers
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const sourceId = event.operation?.source?.id as string | undefined
      if (sourceId) {
        setActiveDragId(sourceId)
      }
    },
    [setActiveDragId],
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveDragId(null)
      if (event.canceled) return

      const isBlindActive = useBlindStore.getState().isActive
      const currentItemId = useBlindStore.getState().currentItemId
      const lockedItemIds = useBlindStore.getState().lockedItemIds

      const sourceId = event.operation?.source?.id as string | undefined
      const targetId = event.operation?.target?.id as string | undefined

      // Handle Blind Challenge spotlight card drop
      if (isBlindActive && currentItemId && sourceId === currentItemId) {
        const { containers: currentContainers, tiers } = useTierDataStore.getState()

        let resolvedTierId: string | null = null
        if (targetId && targetId !== 'POOL') {
          if (tiers.some((t) => t.id === targetId)) {
            resolvedTierId = targetId
          } else {
            // Find container containing the target item
            for (const [tierId, itemIds] of Object.entries(currentContainers)) {
              if (tierId !== 'POOL' && itemIds.includes(targetId)) {
                resolvedTierId = tierId
                break
              }
            }
          }
        }

        if (resolvedTierId) {
          const assigned = useBlindStore.getState().assignBlindCurrentItem(resolvedTierId)
          if (assigned) return
        }
        return
      }

      // If in blind mode, do not allow moving locked items
      if (isBlindActive && sourceId && lockedItemIds.includes(sourceId)) {
        return
      }

      setContainers((prevContainers) => move(prevContainers, event))
    },
    [setActiveDragId, setContainers],
  )

  return (
    <DragDropProvider onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div
        className={`min-h-screen ${pageBgClass} text-foreground flex flex-col font-sans antialiased transition-colors duration-200 relative`}
      >
        {/* Top Navbar (Hidden in presentation mode for full immersion) */}
        {!previewMode && <Navbar />}

        {/* Main Canvas Area */}
        <main
          className={`flex-1 px-3 sm:px-6 max-w-7xl w-full mx-auto space-y-4 sm:space-y-6 transition-all duration-200 ${
            previewMode ? 'py-8 sm:py-12 pb-36' : 'py-4 sm:py-6 pb-32'
          }`}
        >
          {/* Main Tier Canvas */}
          <TierList />

          {/* Unassigned Item Vault Dock (Hidden in presentation mode) */}
          <ItemsList />
        </main>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeItem ? <DraggableItem item={activeItem} isOverlay /> : null}
        </DragOverlay>

        {/* Floating Studio Dock */}
        <FloatingStudioDock />

        {/* Presentation HUD Toolbar */}
        <FullscreenView />

        {/* Key Shortcuts Footer */}
        <Footer />

        {/* Global Action Modals */}
        <AddItemModal />
        <ExportModal />
        <TemplateSelectorModal />
        <RandomPickerModal />
        <BlindChallengeSetupModal />
        <BlindChallengeSummaryModal />
      </div>
    </DragDropProvider>
  )
}
