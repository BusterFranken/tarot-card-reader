# Tarot Card Reader

A beautiful Next.js application featuring motivational quotes and authentic tarot card readings with a clean, modern design using Tailwind CSS.

## Features

### Motivational Quotes
- Fetches motivational quotes from the internet (quotable.io API)
- Falls back to curated quotes if API is unavailable
- Dynamic background images that match each quote
- Minimal, clean design with Tailwind CSS
- "New Quote" button to refresh quotes
- Responsive design for mobile and desktop

### Tarot Card Reading
- Complete 78-card tarot deck (Major Arcana + Minor Arcana)
- Authentic three-card spread: Past, Present, Future
- Real tarot card images with proper upright/reversed meanings
- Card combination interpretations
- Element-based readings (Fire, Water, Air, Earth)
- Professional reading flow with shuffling animation
- Individual card meanings plus combined reading interpretation

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

- Click **"Quotes"** tab for motivational quotes
- Click **"Tarot Reading"** tab for tarot card readings

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Next.js Image Optimization

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── image/        # Background image generation
│   │   └── quote/         # Quote fetching API
│   ├── components/
│   │   └── Navigation.tsx # Navigation tabs
│   ├── data/
│   │   └── tarotCards.ts # Complete tarot deck data
│   ├── tarot/
│   │   └── page.tsx      # Tarot reading page
│   └── page.tsx          # Quotes page
└── public/
    └── cards/            # Tarot card images
```

## How Tarot Readings Work

1. **Focus Your Question**: Enter a question or area of your life you seek guidance on
2. **Shuffling**: The deck is shuffled while you focus on your question
3. **Card Selection**: Three cards are drawn for Past, Present, and Future
4. **Revelation**: Cards reveal one by one with their meanings
5. **Interpretation**: See individual card meanings plus a combined reading

The reading includes:
- Upright/Reversed card meanings
- Position-based interpretations (Past, Present, Future)
- Element combinations (Fire, Water, Air, Earth)
- Special card combination meanings
- Overall reading synthesis

## License

MIT
