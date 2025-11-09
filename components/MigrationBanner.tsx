'use client'
import React from 'react'

export default function MigrationBanner({ message }: { message: string }) {
  return (
    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
      <h3 className="font-semibold text-red-700">Database table not found</h3>
      <p className="mt-2 text-sm text-red-600">{message}</p>
      <div className="mt-3 text-sm text-gray-700">
        <p>Please run the migration to create the <code className="bg-gray-100 px-1 py-0.5 rounded">public.tasks</code> table.</p>
        <p className="mt-2">Quick command (Supabase CLI):</p>
        <pre className="mt-2 rounded bg-gray-900 p-2 text-xs text-white">supabase db push --file supabase/migrations/001_init.sql</pre>
        <p className="mt-2">Or paste the SQL from <code className="bg-gray-100 px-1 py-0.5 rounded">supabase/migrations/001_init.sql</code> into the Supabase SQL editor (Dashboard → SQL).</p>
      </div>
    </div>
  )
}
