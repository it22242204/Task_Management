'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { getSupabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'

type FormData = {
  email: string
  password: string
}

export default function LoginPage() {
  const { register, handleSubmit } = useForm<FormData>()
  const [isSignUp, setIsSignUp] = useState(false)
  const router = useRouter()

  async function onSubmit(data: FormData) {
    const supabase = getSupabase()
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email: data.email, password: data.password })
      if (error) return alert(error.message)
      alert('Check your email for a confirmation (if enabled). You can now sign in.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email: data.email, password: data.password })
      if (error) return alert(error.message)
      router.push('/tasks')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <h2 className="text-xl font-semibold mb-4">{isSignUp ? 'Create account' : 'Sign in'}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input {...register('email', { required: true })} placeholder="Email" className="w-full border px-3 py-2 rounded" />
        <input {...register('password', { required: true })} type="password" placeholder="Password" className="w-full border px-3 py-2 rounded" />
        <div className="flex items-center justify-between">
          <button type="submit" className="bg-sky-600 text-white px-4 py-2 rounded">{isSignUp ? 'Sign up' : 'Sign in'}</button>
          <button type="button" onClick={() => setIsSignUp((s) => !s)} className="text-sm text-sky-600">{isSignUp ? 'Have an account? Sign in' : 'Create account'}</button>
        </div>
      </form>
    </div>
  )
}
