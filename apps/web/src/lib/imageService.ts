/**
 * Open-Source Image Search Service
 * Powered by Wikipedia & Wikimedia Commons REST APIs (Free, Open-Source, CORS-friendly, No API Key Required)
 */

export type ImageSearchResult = {
  id: string
  title: string
  description?: string
  thumbnailUrl: string
  originalUrl?: string
  source: 'wikipedia' | 'wikimedia'
}

/**
 * Search Wikipedia articles and images for an exact or fuzzy search query
 */
export async function searchOpenSourceImages(
  query: string,
  limit: number = 12,
): Promise<ImageSearchResult[]> {
  const trimmed = query.trim()
  if (!trimmed) return []

  try {
    // 1. Search Wikipedia pages with pageimages and extracts
    const wikiEndpoint = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
      trimmed,
    )}&gsrlimit=${limit}&prop=pageimages|extracts|info&piprop=thumbnail&pithumbsize=400&exintro=1&explaintext=1&exsentences=1&format=json&origin=*`

    const response = await fetch(wikiEndpoint)
    if (!response.ok) {
      throw new Error(`Wikipedia API error: ${response.statusText}`)
    }

    const data = await response.json()
    const pages = data.query?.pages || {}
    const results: ImageSearchResult[] = []

    for (const pageId of Object.keys(pages)) {
      const page = pages[pageId]
      if (page.thumbnail?.source) {
        results.push({
          id: `wiki-${page.pageid}`,
          title: page.title,
          description: page.extract || page.description || undefined,
          thumbnailUrl: page.thumbnail.source,
          originalUrl: page.thumbnail.source,
          source: 'wikipedia',
        })
      }
    }

    // If fewer than 4 results found, also search Wikimedia Commons media repository directly
    if (results.length < 4) {
      try {
        const commonsEndpoint = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
          trimmed,
        )}&gsrnamespace=6&gsrlimit=8&prop=imageinfo&iiprop=url&iiurlwidth=400&format=json&origin=*`

        const commonsRes = await fetch(commonsEndpoint)
        if (commonsRes.ok) {
          const commonsData = await commonsRes.json()
          const commonsPages = commonsData.query?.pages || {}

          for (const cId of Object.keys(commonsPages)) {
            const cPage = commonsPages[cId]
            const imgInfo = cPage.imageinfo?.[0]
            if (imgInfo?.thumburl || imgInfo?.url) {
              const cleanTitle = (cPage.title || '')
                .replace(/^File:/i, '')
                .replace(/\.[^/.]+$/, '')
                .replace(/_/g, ' ')

              results.push({
                id: `commons-${cPage.pageid}`,
                title: cleanTitle,
                thumbnailUrl: imgInfo.thumburl || imgInfo.url,
                originalUrl: imgInfo.url,
                source: 'wikimedia',
              })
            }
          }
        }
      } catch (commonsErr) {
        console.warn('Wikimedia Commons fallback search error:', commonsErr)
      }
    }

    return results
  } catch (error) {
    console.error('Error fetching open source images:', error)
    return []
  }
}
