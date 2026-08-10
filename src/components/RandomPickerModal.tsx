import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DicesIcon,
  RotateLeft01Icon,
} from "@hugeicons/core-free-icons";
import { useTierListStore } from "../store/useTierListStore";
import type { TierItem } from "../lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function RandomPickerModal() {
  const {
    isRandomPickerOpen,
    setRandomPickerOpen,
    items,
    containers,
    tiers,
    moveItemToTier,
  } = useTierListStore();

  const poolItemIds = containers["POOL"] || [];
  const poolItems = poolItemIds
    .map((id) => items.find((it) => it.id === id))
    .filter((it): it is TierItem => Boolean(it));

  const [selectedItem, setSelectedItem] = useState<TierItem | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayedItem, setDisplayedItem] = useState<TierItem | null>(null);

  const handleSpin = () => {
    if (poolItems.length === 0 || isSpinning) return;
    setIsSpinning(true);
    setSelectedItem(null);

    let counter = 0;
    const totalSteps = 20;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * poolItems.length);
      setDisplayedItem(poolItems[randomIndex]);
      counter++;

      if (counter >= totalSteps) {
        clearInterval(interval);
        const finalItem =
          poolItems[Math.floor(Math.random() * poolItems.length)];
        setSelectedItem(finalItem);
        setDisplayedItem(finalItem);
        setIsSpinning(false);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      }
    }, 80);
  };

  useEffect(() => {
    if (
      isRandomPickerOpen &&
      poolItems.length > 0 &&
      !selectedItem &&
      !isSpinning
    ) {
      handleSpin();
    }
  }, [isRandomPickerOpen]);

  if (!isRandomPickerOpen) return null;

  const handleAssignAndNext = (tierId: string) => {
    if (!selectedItem) return;
    moveItemToTier(selectedItem.id, tierId);
    setSelectedItem(null);
    setDisplayedItem(null);

    // Check if remaining pool items exist
    const remainingCount = poolItemIds.filter(
      (id) => id !== selectedItem.id,
    ).length;
    if (remainingCount > 0) {
      setTimeout(() => {
        handleSpin();
      }, 200);
    } else {
      setRandomPickerOpen(false);
    }
  };

  return (
    <Dialog open={isRandomPickerOpen} onOpenChange={setRandomPickerOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <HugeiconsIcon icon={DicesIcon} size={18} />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">
                Streamer Roulette
              </DialogTitle>
              <DialogDescription className="text-xs">
                Randomly pick and rank unassigned items live!
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Modal Body */}
        <div className="p-4 text-center space-y-5">
          {poolItems.length === 0 ? (
            <div className="py-6 space-y-2">
              <p className="text-sm font-bold text-foreground">
                All items are ranked!
              </p>
              <p className="text-xs text-muted-foreground">
                No items remaining in the pool to spin.
              </p>
            </div>
          ) : (
            <>
              {/* Spinning Item Card Showcase */}
              <div className="relative mx-auto w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden shadow-2xl border-2 border-indigo-500/60 bg-zinc-900 flex flex-col items-center justify-center group">
                {displayedItem?.imageUrl ? (
                  <img
                    src={displayedItem.imageUrl}
                    alt={displayedItem.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center text-white font-black text-3xl">
                    {displayedItem?.title.slice(0, 2).toUpperCase() || "🎲"}
                  </div>
                )}

                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />

                <div className="absolute bottom-2 inset-x-2 text-center">
                  <h4 className="font-extrabold text-white text-sm sm:text-base leading-tight drop-shadow-md">
                    {displayedItem?.title || "Spinning..."}
                  </h4>
                  {displayedItem?.category && (
                    <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/60 text-zinc-300 border border-white/10">
                      {displayedItem.category}
                    </span>
                  )}
                </div>

                {isSpinning && (
                  <div className="absolute inset-0 bg-indigo-950/40 backdrop-blur-xs flex items-center justify-center">
                    <span className="animate-spin text-white">
                      <HugeiconsIcon icon={RotateLeft01Icon} size={32} />
                    </span>
                  </div>
                )}
              </div>

              {/* Status Message */}
              <div className="space-y-1">
                {isSpinning ? (
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 animate-pulse">
                    Spinning the roulette wheel...
                  </p>
                ) : selectedItem ? (
                  <p className="text-xs font-semibold text-muted-foreground">
                    Select a tier to place{" "}
                    <span className="text-foreground font-bold">
                      "{selectedItem.title}"
                    </span>
                    :
                  </p>
                ) : null}
              </div>

              {/* Tier Assignment Buttons */}
              {selectedItem && !isSpinning && (
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                    {tiers.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleAssignAndNext(t.id)}
                        style={{
                          backgroundColor: t.color,
                          color: t.textColor || "#fff",
                        }}
                        className="py-2.5 px-2 rounded-xl font-black text-xs shadow-md hover:scale-105 active:scale-95 transition-all truncate"
                        title={`Assign to ${t.title}`}
                      >
                        {t.title.split(" ")[0]}
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-center pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleSpin}
                      className="gap-1.5 text-xs font-semibold"
                    >
                      <HugeiconsIcon icon={RotateLeft01Icon} size={14} />
                      <span>Re-spin / Skip Item</span>
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
