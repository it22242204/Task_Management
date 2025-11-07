'use client'
import React from 'react'
import { getSupabase } from '../lib/supabaseClient'

type Task = {
  id: string
  title: string
  completed: boolean
}

export default function TaskList({ tasks, onChanged }: { tasks: Task[]; onChanged: () => void }) {
  async function toggle(task: Task) {
    const supabase = getSupabase()
    await supabase.from('tasks').update({ completed: !task.completed }).eq('id', task.id)
    onChanged()
  }

  async function remove(id: string) {
    const supabase = getSupabase()
    await supabase.from('tasks').delete().eq('id', id)
    onChanged()
  }

  return (
    <ul className="mt-4 space-y-2">
      {tasks.map((t) => (
        <li key={t.id} className="flex items-center justify-between bg-white p-3 rounded shadow-sm">
          <div className="flex items-center gap-3">
            <input type="checkbox" checked={t.completed} onChange={() => toggle(t)} />
            <span className={t.completed ? 'line-through text-gray-400' : ''}>{t.title}</span>
          </div>
          <button onClick={() => remove(t.id)} className="text-sm text-red-600">Delete</button>
        </li>
      ))}
    </ul>
  )
}
