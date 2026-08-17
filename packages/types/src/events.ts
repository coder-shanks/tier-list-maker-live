import type { TierItem, TierRow } from './models'

export interface UserPresence {
  socketId: string
  userId?: string
  username: string
  avatarUrl?: string
  cursorPosition?: { x: number; y: number }
  color: string
}

export type LiveRoomEvent =
  | { type: 'ROOM_JOINED'; payload: { roomId: string; presence: UserPresence[] } }
  | { type: 'USER_JOINED'; payload: { user: UserPresence } }
  | { type: 'USER_LEFT'; payload: { socketId: string } }
  | {
      type: 'CURSOR_MOVED'
      payload: { socketId: string; position: { x: number; y: number } }
    }
  | {
      type: 'ITEM_MOVED'
      payload: {
        itemId: string
        sourceRowId: string | null
        targetRowId: string | null
        newIndex: number
      }
    }
  | { type: 'ROW_UPDATED'; payload: { rowId: string; updates: Partial<TierRow> } }
  | { type: 'TIER_STATE_SYNC'; payload: { rows: TierRow[]; unrankedItems: TierItem[] } }
