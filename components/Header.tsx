'use client'
import Link from 'next/link'
import { getSupabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function Header() {
  const router = useRouter()

  async function signOut() {
    const supabase = getSupabase()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="flex items-center justify-between py-4">
      <h1 className="text-2xl font-semibold">Task Manager</h1>
      <nav className="space-x-4">
        <Link href="/tasks" className="text-sm text-sky-600">Tasks</Link>
        <button onClick={signOut} className="text-sm text-red-600">Sign out</button>
      </nav>
    </header>
  )
}
