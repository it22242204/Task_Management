'use client'
import Link from 'next/link'
import { getSupabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function Header() {
  const router = useRouter()
  const [email, setEmail] = React.useState<string | null>(null)

  React.useEffect(() => {
    let mounted = true
    try {
      const supabase = getSupabase()
      supabase.auth.getUser().then(({ data }) => {
        if (!mounted) return
        setEmail(data?.user?.email ?? null)
      })
    } catch (e) {
    }
    return () => {
      mounted = false
    }
  }, [])

  async function signOut() {
    const supabase = getSupabase()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="flex  justify-between ml-4 mr-4 py-4">
      <h1 className="text-2xl text-gray-500 font-semibold">Task Manager</h1>
      <nav className="flex items-center gap-4">
        <Link href="/tasks" className="text-sm text-sky-600">Tasks</Link>
        {email ? <span className="text-sm text-gray-600">{email}</span> : null}
        <button onClick={signOut} className="text-sm text-red-600">Sign out</button>
      </nav>
    </header>
  )
}
