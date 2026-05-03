# Khmer Interactive Map

Nuxt 4 application for an interactive Cambodia province map. The UI runs in heatmap mode by default, keeps hover inspection enabled, and supports province comparison from the sidebar dropdown.

## Setup

```bash
npm install
npm run dev
```

Local development runs at `http://localhost:3000`.

## Production

```bash
npm run build
npm run preview
```

The production build outputs to `.output/`.

## API Endpoints

`GET /api/map`

Returns province report data:

```ts
interface MapApiResponse {
  totalReport: number
  totalItems: number
  items: Array<{
    id: string
    name: string
    totalReport: number
  }>
}
```

`GET /api/svg`

Returns the extracted Cambodia SVG province features used by the interactive map layer:

```ts
interface SvgApiResponse {
  features: string
}
```

Production note: replace the static data in `server/api/map.get.ts` with your database or external API call when real report data is available. Keep province ids aligned with the SVG ids such as `KH1`, `KH12`, and `KH25`.
