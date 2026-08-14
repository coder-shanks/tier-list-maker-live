import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { TEMPLATES } from '../lib/constants'

export interface MetadataState {
  title: string
  subtitle: string
  author: string
  selectedTemplateId: string

  setTitle: (title: string) => void
  setSubtitle: (subtitle: string) => void
  setAuthor: (author: string) => void
  setSelectedTemplateId: (id: string) => void
  updateMetadata: (meta: { title: string; subtitle: string; author: string }) => void
}

const defaultTemplate = TEMPLATES[0]

export const useMetadataStore = create<MetadataState>()(
  persist(
    (set) => ({
      title: defaultTemplate.title,
      subtitle: defaultTemplate.subtitle,
      author: defaultTemplate.author,
      selectedTemplateId: defaultTemplate.id,

      setTitle: (title) => set({ title }),
      setSubtitle: (subtitle) => set({ subtitle }),
      setAuthor: (author) => set({ author }),
      setSelectedTemplateId: (selectedTemplateId) => set({ selectedTemplateId }),
      updateMetadata: ({ title, subtitle, author }) => set({ title, subtitle, author }),
    }),
    {
      name: 'tier-list-metadata-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
