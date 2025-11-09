"use client"
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { getSupabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'

type FormData = {
  email: string
  password: string
}

export default function LoginPage() {
  const { register, handleSubmit, formState } = useForm<FormData>()
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function onSubmit(data: FormData) {
    setError(null)
    setLoading(true)
    try {
      const supabase = getSupabase()
      if (isSignUp) {
        const { error: e } = await supabase.auth.signUp({ email: data.email, password: data.password })
        if (e) throw e
        setError('Check your email for confirmation (if enabled). Then sign in.')
      } else {
        const { error: e } = await supabase.auth.signInWithPassword({ email: data.email, password: data.password })
        if (e) throw e
        router.push('/tasks')
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 to-white">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-sky-700">Task Manager</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to manage your tasks securely</p>
        </div>

        {error ? <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div> : null}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600">Email</label>
            <input {...register('email', { required: true })} type="email" placeholder="you@example.com" className="mt-1 w-full rounded-md border px-3 py-2 shadow-sm focus:ring-2 focus:ring-sky-200" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600">Password</label>
            <input {...register('password', { required: true })} type="password" placeholder="••••••••" className="mt-1 w-full rounded-md border px-3 py-2 text-gray-500 shadow-sm focus:ring-2 focus:ring-sky-200" />
          </div>

          <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-sky-600 px-4 py-2 text-white font-medium hover:bg-sky-700 disabled:opacity-60">
            {loading ? (isSignUp ? 'Creating account...' : 'Signing in...') : (isSignUp ? 'Create account' : 'Sign in')}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">
          <button onClick={() => { setIsSignUp((s) => !s); setError(null) }} className="text-sky-600 hover:underline">
            {isSignUp ? 'Have an account? Sign in' : "Don't have an account? Create one"}
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          By continuing you agree to the demo's terms. This app uses Supabase for authentication and data.
        </div>
      </div>
    </div>
  )
}
