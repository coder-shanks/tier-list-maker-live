import type { DragItem, Tier } from "./types";

const TIERS: Tier[] = [
  {
    id: "S",
    title: "S",
    bgColor: "bg-red-400",
  },
  {
    id: "A",
    title: "A",
    bgColor: "bg-orange-500",
  },
  {
    id: "B",
    title: "B",
    bgColor: "bg-orange-300",
  },
  {
    id: "C",
    title: "C",
    bgColor: "bg-green-500",
  },
  {
    id: "D",
    title: "D",
    bgColor: "bg-green-200",
  },
  {
    id: "E",
    title: "E",
    bgColor: "bg-green-100",
  },
]

const INITIAL_STATE: Record<string, number[]> = {
  "S": [1, 2, 4],
  "A": [3],
  "B": [],
  "C": [],
  "D": [],
  "E": [],
  "POOL": [5, 6, 7, 8] // items from unassigned pool
}

const DRAGGABLE_ITEMS: DragItem[] = [
  { id: 1, content: "1" },
  { id: 2, content: "2" },
  { id: 3, content: "3" },
  { id: 4, content: "4" },
  { id: 5, content: "5" },
  { id: 6, content: "6" },
  { id: 7, content: "7" },
  { id: 8, content: "8" },
]

export { DRAGGABLE_ITEMS, INITIAL_STATE, TIERS }