import { useCallback, useMemo } from "react";
import {
  DragDropProvider,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import { useUiStore } from "./store/useUiStore";
import { useTierDataStore } from "./store/useTierDataStore";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import Navbar from "./components/Navbar";
import TierList from "./components/TierList";
import ItemsList from "./components/ItemsList";
import AddItemModal from "./components/AddItemModal";
import ExportModal from "./components/ExportModal";
import TemplateSelectorModal from "./components/TemplateSelectorModal";
import RandomPickerModal from "./components/RandomPickerModal";
import FullscreenView from "./components/FullscreenView";
import DraggableItem from "./components/DraggableItem";
import Footer from "./components/Footer";
import { TooltipProvider } from "./components/ui/tooltip";

export default function App() {
  const theme = useUiStore((s) => s.theme);
  const fullscreenMode = useUiStore((s) => s.fullscreenMode);
  const activeDragId = useUiStore((s) => s.activeDragId);
  const setActiveDragId = useUiStore((s) => s.setActiveDragId);

  const items = useTierDataStore((s) => s.items);
  const setContainers = useTierDataStore((s) => s.setContainers);

  // Attach global keyboard shortcuts hook
  useKeyboardShortcuts();

  // Active dragged item calculation memoized
  const activeItem = useMemo(
    () => items.find((it) => it.id === activeDragId),
    [items, activeDragId],
  );

  // Background style class
  const pageBgClass =
    theme === "dark" ? "studio-grid-dark" : "studio-grid-light";

  // DnD callbacks memoized with @dnd-kit/helpers
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const sourceId = event.operation?.source?.id as string | undefined;
      if (sourceId) {
        setActiveDragId(sourceId);
      }
    },
    [setActiveDragId],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveDragId(null);
      if (event.canceled) return;
      setContainers((prevContainers) => move(prevContainers, event));
    },
    [setActiveDragId, setContainers],
  );

  return (
    <TooltipProvider delay={0}>
      <DragDropProvider onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div
          className={`min-h-screen ${pageBgClass} text-foreground flex flex-col font-sans antialiased transition-colors duration-200 relative`}
        >
          {/* Top Navbar */}
          {!fullscreenMode && <Navbar />}

          {/* Main Canvas Area */}
          <main
            className={`flex-1 px-3 sm:px-6 max-w-7xl w-full mx-auto space-y-4 sm:space-y-6 transition-all duration-200 ${
              fullscreenMode ? "py-6 sm:py-10" : "py-4 sm:py-6"
            }`}
          >
            {/* Main Tier Canvas */}
            <TierList />

            {/* Unassigned Item Vault Dock */}
            <ItemsList />
          </main>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeItem ? <DraggableItem item={activeItem} isOverlay /> : null}
          </DragOverlay>

          {/* Presentation HUD View */}
          <FullscreenView />

          {/* Key Shortcuts Footer */}
          <Footer />

          {/* Global Action Modals */}
          <AddItemModal />
          <ExportModal />
          <TemplateSelectorModal />
          <RandomPickerModal />
        </div>
      </DragDropProvider>
    </TooltipProvider>
  );
}
