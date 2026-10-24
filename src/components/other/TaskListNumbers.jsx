import React from 'react'

export default function TaskListNumbers({ data }) {
  const counts = (data.tasks || []).reduce((result, task) => {
    const status = task.completed ? 'completed' : task.failed ? 'failed' : task.active ? 'active' : 'newTask'
    result[status] += 1
    return result
  }, { newTask: 0, active: 0, completed: 0, failed: 0 })

  const cards = [
    ['New tasks', counts.newTask, 'bg-blue-700'],
    ['Completed', counts.completed, 'bg-green-700'],
    ['Active', counts.active, 'bg-amber-700'],
    ['Failed', counts.failed, 'bg-red-800']
  ]
  return <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">{cards.map(([label, count, color]) => <div key={label} className={`rounded-xl ${color} px-6 py-5`}><h2 className="text-3xl font-bold">{count}</h2><p className="mt-1 font-medium">{label}</p></div>)}</div>
}
