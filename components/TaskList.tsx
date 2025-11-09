'use client'
import React from 'react'
import { getSupabase } from '../lib/supabaseClient'

type Task = {
  id: string
  title: string
  completed: boolean
}

export default function TaskList({ tasks, onChanged, onError }: { tasks: Task[]; onChanged: () => void; onError?: (msg: string) => void }) {
  const [mutating, setMutating] = React.useState<string | null>(null)

  async function toggle(task: Task) {
    setMutating(task.id)
    try {
      const supabase = getSupabase()
      const { error } = await supabase.from('tasks').update({ completed: !task.completed }).eq('id', task.id)
      if (error) {
        onError?.(error.message)
        return
      }
      onChanged()
    } finally {
      setMutating(null)
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this task?')) return
    setMutating(id)
    try {
      const supabase = getSupabase()
      const { error } = await supabase.from('tasks').delete().eq('id', id)
      if (error) {
        onError?.(error.message)
        return
      }
      onChanged()
    } finally {
      setMutating(null)
    }
  }

  return (
    <ul className="mt-4 divide-y divide-gray-100 rounded-md overflow-hidden shadow-sm">
      {tasks.map((t) => (
        <li key={t.id} className="flex items-center justify-between bg-white px-4 py-3">
          <div className="flex items-center gap-4">
            <input type="checkbox" checked={t.completed} onChange={() => toggle(t)} disabled={!!mutating} className="w-4 h-4" />
            <span className={t.completed ? 'line-through text-gray-400' : 'text-gray-900'}>{t.title}</span>
          </div>
          <button onClick={() => remove(t.id)} className="text-sm text-red-600 hover:underline" disabled={!!mutating}>
            {mutating === t.id ? 'Working...' : 'Delete'}
          </button>
        </li>
      ))}
      {tasks.length === 0 ? (
        <li className="p-6 text-center text-gray-500 bg-white">No tasks yet — add your first task above.</li>
      ) : null}
    </ul>
  )
}
