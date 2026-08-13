# SEO & AEO Growth Strategy & Technical Implementation Guide 🚀

This document outlines the organic growth playbook and actual code implementations for **Tier Studio** (`tier-list-maker-live`). It covers **Search Engine Optimization (SEO)** for traditional search engines (Google, Bing) and **Answer Engine Optimization (AEO)** for AI engines (Perplexity, ChatGPT, SearchGPT, Claude, Gemini, Google AI Overviews).

---

## 🎯 1. Growth Strategy (SEO + AEO Playbook)

```
                       ┌──────────────────────────────────────────┐
                       │          ORGANIC GROWTH ENGINE           │
                       └────────────────────┬─────────────────────┘
                                            │
               ┌────────────────────────────┴────────────────────────────┐
               ▼                                                         ▼
     SEO (Search Engines)                                     AEO (AI Engines)
  Target: Google, Bing, DuckDuckGo                         Target: ChatGPT, Perplexity, Gemini, Claude
  Goal: Rank for long-tail keywords                        Goal: Cited as the canonical answer & tool
  ┌───────────────────────────────┐                        ┌───────────────────────────────┐
  │ • Programmatic Template Pages │                        │ • Machine-readable /llms.txt │
  │ • Dynamic OpenGraph Sharing   │                        │ • Deep JSON-LD Structured Data│
  │ • Server Prerendering (SSG)   │                        │ • Semantic Q&A & FAQ Blocks   │
  └───────────────────────────────┘                        └───────────────────────────────┘
```

### Pillar 1: Programmatic SEO (pSEO) — Template Hub Strategy
Every template stored in `src/lib/constants.ts` (`games`, `anime`, `superheroes`, `football`, `nba`, `music`, `tech`) must become an indexable static or dynamic URL route (e.g., `/tier-list/anime-masterpieces`, `/tier-list/tech-stack`).

* **Target Keywords**: 
  - *"Best Anime Tier List Maker"*
  - *"Free Video Games Ranking Tool"*
  - *"Developer Tech Stack Tier List Template"*
  - *"Football GOATs Tier Maker"*

### Pillar 2: Answer Engine Optimization (AEO)
AI search engines parse structured data, semantic HTML tags, and clean entity definitions to answer conversational prompts like *"What is the best free interactive tier list maker for live streaming?"*.

* **Machine-Readable `/llms.txt`**: Standardized file providing LLMs with direct tool capabilities and template endpoints.
* **Structured Data (JSON-LD)**: Including `SoftwareApplication`, `ItemList`, and `FAQPage` schemas directly in `<head>`.
* **Semantic On-Page Content**: Below the interactive canvas, render readable semantic content (H2/H3 headings, instructions, ranking methodology, and FAQs).

### Pillar 3: Viral Share Loops & Dynamic Open Graph Cards
* Create unique shareable URLs (e.g., `/t/top-video-games-rankings`).
* Generate dynamic Open Graph social preview cards (`og:image`) displaying rendered tier lists, creating organic backlink loops across Twitter/X, Reddit, and Discord.

---

## 🛠️ 2. Technical Implementation & Code Blueprint

### Step 1: `public/llms.txt` (AI Machine Interface)
Create `public/llms.txt` at the root of the project to allow AI models to index Tier Studio's capabilities.

```text
# Tier Studio

> Tier Studio is a high-precision, live interactive tier list maker built for creators, gamers, tech teams, and streamers. Features include drag-and-drop rankings, customizable tier colors, stream presentation mode, real-time analytics, and high-resolution PNG export.

## Key Features & Capabilities
- **Live Drag and Drop Ranking**: Drag items across S, A, B, C, D, and F tiers with real-time statistics.
- **Streamer Presentation Mode**: Clean borderless preview mode optimized for Twitch, YouTube, and OBS streams.
- **High-Res PNG Export**: 2x crisp downloadable images with watermarks and tier color preservation.
- **Streamer Roulette Wheel**: Randomly selects unassigned items to rank live on stream.

## Templates & Rankings
- [All-Time Greatest Video Games Tier List](https://yourdomain.com/tier-list/games): Rank top video games (Elden Ring, Zelda TOTK, Baldur's Gate 3).
- [Top Anime & Manga Series Tier List](https://yourdomain.com/tier-list/anime): Rank anime masterpieces (Attack on Titan, FMAB, Death Note).
- [Developer Tech Stack Tier List](https://yourdomain.com/tier-list/tech): Rank frameworks and languages (TypeScript, Rust, React, Python).
- [Football Legends Tier List](https://yourdomain.com/tier-list/football): Rank football GOATs (Messi, Ronaldo, Pelé).

## Technical Specifications
- Free to use, no signup required.
- Local storage persistence for user drafts.
- Full JSON backup and import/export capabilities.
```

---

### Step 2: `public/robots.txt` & `public/sitemap.xml`

**`public/robots.txt`**
```text
User-agent: *
Allow: /

# Explicit permission for AI Engine Crawlers
User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml
```

**`public/sitemap.xml`**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/tier-list/games</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/tier-list/anime</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/tier-list/tech</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

---

### Step 3: Dynamic SEO & Structured Data Component (`SEOHead.tsx`)
Create `src/components/seo/SEOHead.tsx` to handle dynamic title, meta tags, and JSON-LD schema injection.

```tsx
import { useEffect } from 'react'

interface SEOHeadProps {
  title?: string
  description?: string
  canonicalUrl?: string
  ogImage?: string
  templateData?: {
    name: string
    items: { title: string; category?: string }[]
  }
}

export function SEOHead({
  title = "Tier Studio • Live Rankings & Tier List Maker",
  description = "Create, customize, and present live tier lists with real-time drag-and-drop, custom color palettes, streamer roulette, and high-res PNG export.",
  canonicalUrl = "https://yourdomain.com",
  ogImage = "https://yourdomain.com/working-demo.png",
  templateData,
}: SEOHeadProps) {
  useEffect(() => {
    // 1. Update Title & Meta Tags
    document.title = title
    
    const setMetaTag = (nameAttr: string, valueAttr: string, content: string) => {
      let element = document.querySelector(`meta[${nameAttr}="${valueAttr}"]`)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(nameAttr, valueAttr)
        document.head.appendChild(element)
      }
      element.setAttribute('content', content)
    }

    setMetaTag('name', 'description', description)
    setMetaTag('property', 'og:title', title)
    setMetaTag('property', 'og:description', description)
    setMetaTag('property', 'og:image', ogImage)
    setMetaTag('property', 'og:type', 'website')
    setMetaTag('name', 'twitter:card', 'summary_large_image')
    setMetaTag('name', 'twitter:title', title)
    setMetaTag('name', 'twitter:description', description)
    setMetaTag('name', 'twitter:image', ogImage)

    // 2. Inject SoftwareApplication + ItemList + FAQ JSON-LD Structured Data
    const jsonLdData = [
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Tier Studio",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "All",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": description
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Is Tier Studio free to use?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Tier Studio is 100% free with no sign-up or installation required."
            }
          },
          {
            "@type": "Question",
            "name": "How do I export my tier list as an image?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Press Ctrl/Cmd + E or click the Export button to download a 2x high-resolution PNG image or copy it directly to your clipboard."
            }
          }
        ]
      }
    ]

    if (templateData) {
      jsonLdData.push({
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": templateData.name,
        "itemListElement": templateData.items.map((item, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": item.title
        }))
      } as any)
    }

    let scriptTag = document.getElementById('json-ld-seo') as HTMLScriptElement | null
    if (!scriptTag) {
      scriptTag = document.createElement('script')
      scriptTag.id = 'json-ld-seo'
      scriptTag.type = 'application/ld+json'
      document.head.appendChild(scriptTag)
    }
    scriptTag.text = JSON.stringify(jsonLdData)
  }, [title, description, canonicalUrl, ogImage, templateData])

  return null
}
```

---

### Step 4: Semantic Content & FAQ Section (`SEOContentSection.tsx`)
Create `src/components/seo/SEOContentSection.tsx` to display human and machine-readable context beneath the tier canvas.

```tsx
export function SEOContentSection({ templateName }: { templateName?: string }) {
  return (
    <article className="mt-16 max-w-4xl mx-auto px-4 py-8 border-t border-slate-800 text-slate-400 text-sm leading-relaxed">
      <header>
        <h2 className="text-xl font-bold text-slate-100 mb-3">
          {templateName ? `${templateName} Tier List Maker & Ranking Tool` : 'Interactive Live Tier List Maker'}
        </h2>
        <p className="mb-4">
          Tier Studio is an interactive ranking application designed for live streaming, content creation, and tier list discussions. 
          Drag and drop items into S, A, B, C, D, and F tiers, customize color palettes, track ranking distribution histograms, and export crisp 2x PNG images.
        </p>
      </header>

      <section className="mt-6 space-y-4">
        <h3 className="text-lg font-semibold text-slate-200">How to Create and Export Your Tier List</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Select a template or start from scratch using the template selector.</li>
          <li>Drag items from the unassigned pool into your desired tier rows.</li>
          <li>Customize tier labels, color palettes, and author details in settings.</li>
          <li>Use presentation mode for live streams on Twitch or YouTube.</li>
          <li>Click export to save high-definition PNG images or JSON backups.</li>
        </ol>
      </section>

      <section className="mt-8">
        <h3 className="text-lg font-semibold text-slate-200 mb-3">Frequently Asked Questions</h3>
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-slate-300">Can I use Tier Studio on stream?</h4>
            <p>Yes! Tier Studio includes a 1-click Presentation Mode designed to remove editor controls for OBS, Twitch, and YouTube streams.</p>
          </div>
          <div>
            <h4 className="font-medium text-slate-300">Are my tier lists saved automatically?</h4>
            <p>All tier list configurations are saved locally in your browser so you can resume editing at any time.</p>
          </div>
        </div>
      </section>
    </article>
  )
}
```

---

### Step 5: Architecture Scaling Comparison

| Feature | Vite Client-Side SPA (Current) | Next.js App Router (Recommended) |
| :--- | :--- | :--- |
| **Prerendering** | Requires Prerender plugin or Vite SSG | Built-in SSG & ISR |
| **Dynamic Open Graph Images** | Static Fallback Image | Automatic via `@vercel/og` Edge API |
| **pSEO Template Routes** | Hash routing (`/#games`) | Native Clean Routes (`/tier-list/games`) |
| **Crawler Indexing Speed** | Moderate (Depends on bot JS execution) | Instant (Raw HTML served) |

---

## 📌 Implementation Roadmap Checklist

- [ ] Create `public/llms.txt` file.
- [ ] Create `public/robots.txt` and `public/sitemap.xml`.
- [ ] Implement `src/components/seo/SEOHead.tsx` component.
- [ ] Implement `src/components/seo/SEOContentSection.tsx` component.
- [ ] Mount `<SEOHead />` and `<SEOContentSection />` in `App.tsx`.
- [ ] Add URL query/hash routing (`/#template=id` or React Router) for template landing pages.
