'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { getSupabase } from '../lib/supabaseClient'

type FormData = {
  title: string
}

export default function TaskForm({ onAdded }: { onAdded: () => void }) {
  const { register, handleSubmit, reset } = useForm<FormData>()

  async function onSubmit(data: FormData) {
    // get current user
    const supabase = getSupabase()
    const { data: userData } = await supabase.auth.getUser()
    const user = userData?.user
    if (!user) return alert('You must be signed in')

    const { error } = await supabase.from('tasks').insert([{ title: data.title, user_id: user.id }])
    if (error) return alert(error.message)
    reset()
    onAdded()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
      <input {...register('title', { required: true })} placeholder="New task" className="flex-1 border px-3 py-2 rounded" />
      <button type="submit" className="bg-sky-600 text-white px-4 py-2 rounded">Add</button>
    </form>
  )
}
