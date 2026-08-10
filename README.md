# Live Tier List Maker 🏆

A modern, responsive, and fully customizable **Live Tier List Maker** built with React 19, TypeScript, Vite, Tailwind CSS v4, Zustand, Shadcn UI, and Hugeicons.

---

## ✨ Key Features

### 🎯 Interactive Drag & Drop Board
- **Fluid Drag and Drop**: Powered by `@dnd-kit/react` and `@dnd-kit/helpers` with reordering, active drag shadows, and responsive touch/click fallback.
- **Card Size Options**: Switch between **Compact (S)**, **Normal (M)**, and **Large (L)** card sizes on the fly.
- **Quick Action Menu**: Click any item card to quickly assign it to any tier, send it back to the unassigned pool, edit its title/category, or delete it.

### 🧩 Shadcn UI & Ergonomic Edit UX
- **Shadcn Component Architecture**: Built using `@base-ui/react` primitives styled with Tailwind CSS tokens:
  - `Tooltip` & `TooltipProvider`: Portal-based tooltips with collision avoidance (no container cutoff).
  - `Dialog`: Accessible modals for Add Item, Export, Edit Metadata, Roulette, and Templates.
  - `Popover`: Tier settings and item quick actions.
  - `Button`, `Input`, `Badge`, `Tabs`, `Separator`.
- **Edit Tier List Info Dialog**: Comfortable full-width editing for title, subtitle/criteria, and creator watermark.
- **Tier Settings Popover**: Instant tier renaming, 16 curated color presets, custom color hex picker, and reordering controls.

### 🎨 Dark & Light Mode
- Seamless theme toggle with **Dark Mode** (obsidian glassmorphism) and **Light Mode** (crisp frosted glass).
- Persistent theme preference saved in `localStorage`.

### 👁️ Presentation & Preview Mode
- 1-Click **Preview Mode** that hides all editor buttons for clean live streams, screen shares, and recording.
- Includes a helpful top banner to exit preview mode at any time.

### 📊 Real-Time Ranking Statistics
- Intuitive progress indicators:
  - **Ranked**: Displays how many total items are ranked with a percentage badge (`Ranked: 6/12 (50%)`).
  - **In Pool**: Tracks items remaining in the unassigned pool.

### 🎮 Pre-Loaded Rich Templates
1. 🎮 **Top Video Games** (Elden Ring, Zelda: Tears of the Kingdom, Baldur's Gate 3, GTA V, Witcher 3, Cyberpunk 2077, Minecraft, etc.)
2. ⚽ **Football / Soccer Legends** (Messi, Ronaldo, Pelé, Maradona, Zidane, Ronaldinho, Haaland, Mbappé, etc.)
3. 💻 **Tech Stack & Languages** (TypeScript, Rust, Python, Go, React, Next.js, Docker, Tailwind CSS, etc.)
4. 🎬 **Iconic Movies** (The Dark Knight, Interstellar, Inception, The Godfather, Matrix, Pulp Fiction, etc.)
5. 🍕 **World Foods & Delicacies** (Pizza, Tonkotsu Ramen, Sushi, Tacos, Burgers, Gelato, Biryani, etc.)
6. ✨ **Blank Custom Template** (Start from scratch)

### 🎲 Streamer Roulette
- Spin the animated roulette wheel to randomly select and rank unassigned items live on stream.

### ➕ Custom Item Creator & Bulk Import
- **Single Item**: Add items with custom names, categories, and image URLs or local file uploads (with base64 preview).
- **Bulk Import**: Paste a list of names (one per line) to instantly generate unassigned items.

### 📸 High-Resolution PNG Export & JSON Backup
- **2x High-Res PNG Download**: Generates crisp, downloadable images complete with custom titles, author tags, and tier colors.
- **Copy Image to Clipboard**: Directly paste your tier list into Twitter, Discord, Reddit, or Slack.
- **JSON Configuration Export & Import**: Backup and share your custom tier lists with friends.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| --- | --- |
| `⌘ / Ctrl + Z` | Undo previous action |
| `⌘ / Ctrl + Y` or `⌘ / Ctrl + Shift + Z` | Redo action |
| `⌘ / Ctrl + E` | Open Export Modal (PNG / Clipboard / JSON) |
| `N` | Open Add Custom Item Modal |
| `R` | Open Streamer Roulette |

---

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) (`@base-ui/react`)
- **Icons**: [Hugeicons](https://hugeicons.com/) (`@hugeicons/react`, `@hugeicons/core-free-icons`)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) with `persist` middleware
- **Drag & Drop**: [@dnd-kit/react](https://dndkit.com/) + `@dnd-kit/helpers`
- **Image Generation**: [html-to-image](https://github.com/bubkoo/html-to-image)
- **Effects**: [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Run Development Server
```bash
pnpm dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
pnpm build
```

---

## 📁 Project Structure

```
tier-list-maker-live/
├── src/
│   ├── components/
│   │   ├── ui/                    # Shadcn UI primitives (Button, Dialog, Popover, Tooltip, etc.)
│   │   ├── AddItemModal.tsx       # Single & bulk item creation modal
│   │   ├── DraggableItem.tsx      # Draggable card with quick-action popover
│   │   ├── EditMetadataModal.tsx  # Tier list title, criteria & author edit dialog
│   │   ├── ExportModal.tsx        # High-res PNG & JSON export/import modal
│   │   ├── ItemsList.tsx          # Unassigned items pool with search & filters
│   │   ├── Navbar.tsx             # Top navigation, theme toggle & shortcuts
│   │   ├── RandomPickerModal.tsx  # Streamer roulette wheel
│   │   ├── TemplateSelectorModal.tsx # Category template picker
│   │   ├── TierList.tsx           # Main tier canvas & statistics
│   │   ├── TierRow.tsx            # Individual tier drop zone
│   │   └── TierSettingsPopover.tsx# Tier name, color palette & actions popover
│   ├── lib/
│   │   ├── constants.ts           # Color palettes & preloaded templates
│   │   ├── types.ts               # TypeScript definitions
│   │   └── utils.ts               # Tailwind merge utilities
│   ├── store/
│   │   └── useTierListStore.ts    # Zustand store with persistence & undo/redo
│   ├── App.tsx                    # Root layout & keyboard shortcuts
│   ├── main.tsx                   # React root mount
│   └── index.css                  # Design tokens & theme styles
├── components.json                # Shadcn configuration
├── package.json
└── vite.config.ts
```

---

## 📄 License

MIT License. Feel free to use and customize for your own streams and projects!
