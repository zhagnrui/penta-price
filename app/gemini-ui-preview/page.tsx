import { redirect } from 'next/navigation'

// Dev preview route retired — tool now lives at /[lang]/calculator/ifr-cost
export default function GeminiPreviewRedirect() {
  redirect('/zh/calculator/ifr-cost')
}
