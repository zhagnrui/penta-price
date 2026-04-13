import { redirect } from 'next/navigation'

// Redirect legacy /calculator → /zh/calculator
export default function CalcRedirect() {
  redirect('/zh/calculator')
}
