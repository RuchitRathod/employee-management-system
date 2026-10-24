import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthProvider'

const initialForm = { firstName: '', email: '', password: '' }
export default function CreateEmployee() {
  const [employees, setEmployees] = useContext(AuthContext)
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const change = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }))
  const submit = event => {
    event.preventDefault(); setError(''); setMessage('')
    const firstName = form.firstName.trim()
    const email = form.email.trim().toLowerCase()
    if (!firstName || !email || !form.password.trim()) return setError('Complete all fields before creating the employee.')
    if (email === 'admin@example.com' || employees.some(employee => employee.email.toLowerCase() === email)) return setError('An account with this email already exists.')
    setEmployees(current => [...current, { firstName, email, password: form.password, tasks: [] }])
    setForm(initialForm); setMessage(`Employee account created for ${firstName}.`)
  }
  return <form onSubmit={submit}>
    <div className="form-grid"><div className="form-field"><label htmlFor="employeeName">Full name</label><input id="employeeName" name="firstName" value={form.firstName} onChange={change} required placeholder="e.g. Aarya Patel"/></div><div className="form-field"><label htmlFor="employeeEmail">Work email</label><input id="employeeEmail" name="email" type="email" value={form.email} onChange={change} required placeholder="name@company.com"/></div><div className="form-field full"><label htmlFor="employeePassword">Temporary password</label><input id="employeePassword" name="password" type="password" minLength="3" value={form.password} onChange={change} required placeholder="Set a temporary password"/></div></div>
    {error && <p role="alert" className="form-message error-message">{error}</p>}{message && <p role="status" className="form-message success-message">{message}</p>}
    <div className="form-actions"><button type="button" className="btn" onClick={() => { setForm(initialForm); setError(''); setMessage('') }}>Clear</button><button type="submit" className="btn btn-primary">+ Create employee</button></div>
    <p className="muted helper-note">Demo note: accounts are saved in this browser's local storage. This is a portfolio demo, not production-grade authentication.</p>
  </form>
}
