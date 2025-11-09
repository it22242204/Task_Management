'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { getSupabase } from '../lib/supabaseClient'

type FormData = {
  title: string
}

export default function TaskForm({ onAdded, onError }: { onAdded: () => void; onError?: (msg: string) => void }) {
  const { register, handleSubmit, reset } = useForm<FormData>()
  const [submitting, setSubmitting] = React.useState(false)

  async function onSubmit(data: FormData) {
    setSubmitting(true)
    try {
      const supabase = getSupabase()
      const { data: userData } = await supabase.auth.getUser()
      const user = userData?.user
      if (!user) {
        onError?.('You must be signed in')
        return
      }

      const { error } = await supabase.from('tasks').insert([{ title: data.title, user_id: user.id }])
      if (error) {
        // propagate schema / table errors to the container
        onError?.(error.message)
        return
      }
      reset()
      onAdded()
    } catch (err: any) {
      const msg = String(err?.message || err)
      onError?.(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
      <input {...register('title', { required: true })} placeholder="New task" className="flex-1 border px-3 py-2 rounded  text-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-200" disabled={submitting} />
      <button type="submit" className="bg-sky-600 text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-60" disabled={submitting}>
        {submitting ? 'Adding...' : 'Add'}
      </button>
    </form>
  )
}
