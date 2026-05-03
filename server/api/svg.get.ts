/**
 * Extracts raw SVG inner HTML from the kh-map-demo.html source file.
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export default defineEventHandler(() => {
  const file = resolve(process.cwd(), 'public/kh-map-demo.html')
  const html = readFileSync(file, 'utf-8')

  // Extract everything inside the <g id="features"> tag
  const match = html.match(/<g id="features">([\s\S]*?)<\/g>/)
  const features = match ? match[1].trim() : ''

  return { features }
})
