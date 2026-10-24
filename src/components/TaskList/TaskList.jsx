import React, { useContext, useMemo, useState } from 'react'
import { AuthContext } from '../../context/AuthProvider'
import AcceptTask from './AcceptTask'
import NewTask from './NewTask'
import CompleteTask from './CompleteTask'
import FailedTask from './FailedTask'

export default function TaskList({ data }) {
  const [employees, setEmployees] = useContext(AuthContext)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('dueDate')

  const updateStatus = (taskId, status) => {
    const updated = employees.map(employee => {
      if (employee.email !== data.email) return employee
      return {
        ...employee,
        tasks: employee.tasks.map(task => {
          if (task.id !== taskId) return task
          return {
            ...task,
            active: status === 'active',
            newTask: status === 'new',
            completed: status === 'completed',
            failed: status === 'failed',
            ...(status === 'completed' ? { completedAt: new Date().toISOString() } : {})
          }
        })
      }
    })
    setEmployees(updated)
  }

  const visibleTasks = useMemo(() => {
    const tasks = (data.tasks || []).filter(task => {
      const status = task.completed ? 'completed' : task.failed ? 'failed' : task.active ? 'active' : 'new'
      const matchesStatus = statusFilter === 'all' || status === statusFilter
      const query = search.trim().toLowerCase()
      const matchesSearch = !query || [task.taskTitle, task.taskDescription, task.category].some(value => (value || '').toLowerCase().includes(query))
      return matchesStatus && matchesSearch
    })
    return tasks.sort((a, b) => {
      if (sortBy === 'priority') { const rank = { high: 0, medium: 1, low: 2 }; return rank[a.priority || 'medium'] - rank[b.priority || 'medium'] }
      if (sortBy === 'newest') return (b.createdAt || '').localeCompare(a.createdAt || '')
      return (a.taskDate || '9999').localeCompare(b.taskDate || '9999')
    })
  }, [data.tasks, search, statusFilter, sortBy])

  return (
    <section className="task-workspace">
      <div className="toolbar" style={{ marginBottom: 14 }}>
        <input className="field" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search title, description, category..." />
        <select className="field" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All statuses</option><option value="new">New</option><option value="active">Active</option><option value="completed">Completed</option><option value="failed">Failed</option>
        </select>
        <select className="field" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="dueDate">Sort: due date</option><option value="priority">Sort: priority</option><option value="newest">Sort: newest first</option>
        </select>
      </div>
      {visibleTasks.length === 0 ? <div className="panel empty-state"><div className="empty-icon">⌕</div>No tasks match these filters. Try changing your search or status filter.</div> : (
        <div id="tasklist" className="task-grid">
          {visibleTasks.map(task => {
            const props = { key: task.id, data: task }
            if (task.active) return <AcceptTask {...props} onStatusChange={status => updateStatus(task.id, status)} />
            if (task.completed) return <CompleteTask {...props} onStatusChange={status => updateStatus(task.id, status)} />
            if (task.failed) return <FailedTask {...props} onStatusChange={status => updateStatus(task.id, status)} />
            return <NewTask {...props} onAccept={() => updateStatus(task.id, 'active')} />
          })}
        </div>
      )}
    </section>
  )
}
