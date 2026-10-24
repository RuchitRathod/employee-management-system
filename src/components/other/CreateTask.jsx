import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthProvider'

const emptyForm = { taskTitle: '', taskDescription: '', taskDate: '', asignTo: '', category: '', priority: 'medium' }
export default function CreateTask() {
  const [employees, setEmployees] = useContext(AuthContext)
  const [form, setForm] = useState(emptyForm)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const change = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }))
  const submitHandler = event => {
    event.preventDefault(); setMessage(''); setError('')
    const targetName = form.asignTo.trim().toLowerCase()
    const target = employees.find(employee => employee.firstName.toLowerCase() === targetName || employee.email.toLowerCase() === targetName)
    if (!target) { setError('Employee not found. Enter an exact first name or email address.'); return }
    const task = { id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`, taskTitle: form.taskTitle.trim(), taskDescription: form.taskDescription.trim(), taskDate: form.taskDate, category: form.category.trim() || 'General', priority: form.priority, createdAt: new Date().toISOString(), active: false, newTask: true, completed: false, failed: false }
    setEmployees(current => current.map(employee => employee.email === target.email ? { ...employee, tasks: [...(employee.tasks || []), task] } : employee))
    setForm(emptyForm); setMessage(`Task assigned to ${target.firstName}.`)
  }
  return <form onSubmit={submitHandler}>
    <div className="form-grid">
      <div className="form-field"><label htmlFor="taskTitle">Task title</label><input id="taskTitle" name="taskTitle" required value={form.taskTitle} onChange={change} placeholder="Prepare monthly report"/></div>
      <div className="form-field"><label htmlFor="asignTo">Assign to (name or email)</label><input id="asignTo" name="asignTo" required value={form.asignTo} onChange={change} placeholder="Arjun or e@e.com" list="employee-options"/><datalist id="employee-options">{employees.map(employee => <option key={employee.email} value={employee.firstName}>{employee.email}</option>)}</datalist></div>
      <div className="form-field"><label htmlFor="taskDate">Due date</label><input id="taskDate" type="date" name="taskDate" required value={form.taskDate} onChange={change}/></div>
      <div className="form-field"><label htmlFor="category">Category</label><input id="category" name="category" value={form.category} onChange={change} placeholder="Design, Development…"/></div>
      <div className="form-field"><label htmlFor="priority">Priority</label><select id="priority" name="priority" value={form.priority} onChange={change}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div>
      <div className="form-field full"><label htmlFor="taskDescription">Description</label><textarea id="taskDescription" name="taskDescription" required value={form.taskDescription} onChange={change} placeholder="Describe the expected outcome…"/></div>
    </div>
    {error && <p role="alert" style={{ color: '#ff7b72', fontSize: 12, marginTop: 12 }}>{error}</p>}{message && <p role="status" style={{ color: '#3fb950', fontSize: 12, marginTop: 12 }}>{message}</p>}
    <div className="form-actions"><button type="reset" className="btn" onClick={() => { setForm(emptyForm); setError(''); setMessage('') }}>Clear form</button><button className="btn btn-primary" type="submit">Create task →</button></div>
  </form>
}
