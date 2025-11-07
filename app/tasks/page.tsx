'use client'
import React, { useEffect, useState } from 'react'
import { getSupabase } from '../../lib/supabaseClient'
import Header from '../../components/Header'
import TaskForm from '../../components/TaskForm'
import TaskList from '../../components/TaskList'
import { useRouter } from 'next/navigation'

type Task = {
  id: string
  title: string
  completed: boolean
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  async function load() {
    setLoading(true)
    const supabase = getSupabase()
    const { data: userData } = await supabase.auth.getUser()
    const user = userData?.user
    if (!user) {
      router.push('/login')
      return
    }

    const { data, error } = await supabase.from('tasks').select('*').eq('user_id', user.id).order('inserted_at', { ascending: false })
    if (error) {
      console.error(error)
    } else {
      setTasks((data as any) || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    load()

    const supabaseClient = getSupabase()
    const { data: listener } = supabaseClient.auth.onAuthStateChange((_event: any, session: any) => {
      if (!session) router.push('/login')
    })

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [])

  return (
    <div>
      <Header />
      <div className="mt-6">
        <TaskForm onAdded={load} />
        {loading ? <p className="mt-4">Loading...</p> : <TaskList tasks={tasks} onChanged={load} />}
      </div>
    </div>
  )
}
