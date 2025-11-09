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
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const router = useRouter()

  async function load() {
    setLoading(true)
    setErrorMsg(null)
    const supabase = getSupabase()
    const { data: userData } = await supabase.auth.getUser()
    const user = userData?.user
    if (!user) {
      router.push('/login')
      return
    }
    setUserEmail(user.email ?? null)
    const { data, error } = await supabase.from('tasks').select('*').eq('user_id', user.id).order('inserted_at', { ascending: false })
    if (error) {
      console.error(error)
      // detect common error when migration wasn't applied
      if (error.message && error.message.includes("Could not find the table 'public.tasks'")) {
        setErrorMsg("The 'tasks' table was not found in your Supabase database. Run the migration in the Supabase SQL editor or CLI (see README).")
      } else {
        setErrorMsg(error.message || 'Unknown error loading tasks')
      }
      setTasks([])
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
    <div className="min-h-screen bg-sky-50">
      <Header />

      <main className="max-w-4xl mx-auto py-10 px-4">
        {errorMsg ? (
          <div className="mb-6 rounded-md bg-red-50 border border-red-200 p-4">
            <strong className="text-red-800">Database schema issue:</strong>
            <p className="text-sm text-red-700 mt-1">{errorMsg}</p>
            <p className="text-xs text-gray-600 mt-2">Tip: Run <code className="bg-gray-100 px-1 rounded">supabase/migrations/001_init.sql</code> from the Supabase SQL editor or use <code className="bg-gray-100 px-1 rounded">supabase db push</code>. See README.</p>
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <section className="md:col-span-1 bg-white rounded-2xl p-6 shadow">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold">TM</div>
              <div>
                <h2 className="text-lg text-gray-500 font-semibold">Welcome{userEmail ? `, ${userEmail.split('@')[0]}` : ''} 👋</h2>
                <p className="text-sm text-gray-500 mt-1">Manage your tasks quickly and securely.</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-sm text-gray-600">Total tasks</div>
              <div className="text-2xl text-gray-500 font-bold mt-1">{tasks.length}</div>
              <div className="mt-4 text-sm text-gray-600">Completed</div>
              <div className="text-2xl text-gray-500 font-bold mt-1">{tasks.filter((t) => t.completed).length}</div>
            </div>

            <div className="mt-6 text-xs text-gray-500">Tip: Use the add form to create tasks. If nothing appears, run the migration as instructed in the README.</div>
          </section>

          <section className="md:col-span-2 bg-white rounded-2xl p-6 shadow">
            <div className="flex items-center justify-between">
              <h3 className="text-lg text-gray-500 font-semibold">Your Tasks</h3>
            </div>

            <div className="mt-4">
              <TaskForm onAdded={load} onError={(m) => setErrorMsg(m)} />
            </div>

            <div className="mt-6">
              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading tasks...</div>
              ) : (
                <TaskList tasks={tasks} onChanged={load} onError={(m) => setErrorMsg(m)} />
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
