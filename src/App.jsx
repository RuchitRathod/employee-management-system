import React, { useContext, useEffect, useState } from 'react'
import Login from './components/Auth/Login'
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard'
import AdminDashboard from './components/Dashboard/AdminDashboard'
import { AuthContext } from './context/AuthProvider'

const ADMIN_EMAIL = 'admin@example.com'
const ADMIN_PASSWORD = '123'

export default function App() {
  const [user, setUser] = useState(null)
  const [loggedInUserData, setLoggedInUserData] = useState(null)
  const [userData] = useContext(AuthContext)
  const [adminData, setAdminData] = useState({ firstName: 'Ruchit', email: ADMIN_EMAIL, role: 'admin' })

  useEffect(() => {
    const saved = localStorage.getItem('loggedInUser')
    if (!saved) return
    try {
      const session = JSON.parse(saved)
      if (session?.role === 'admin') {
        setUser('admin')
        setAdminData(session.data || { firstName: 'Ruchit', email: ADMIN_EMAIL, role: 'admin' })
      } else if (session?.role === 'employee' && session.data) {
        setUser('employee')
        setLoggedInUserData(session.data)
      }
    } catch {
      localStorage.removeItem('loggedInUser')
    }
  }, [])

  const handleLogin = (email, password) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const admin = { firstName: 'Ruchit', email: ADMIN_EMAIL, role: 'admin' }
      setAdminData(admin)
      setUser('admin')
      localStorage.setItem('loggedInUser', JSON.stringify({ role: 'admin', data: admin }))
      return
    }

    const employee = (userData || []).find(e => e.email === email && e.password === password)
    if (employee) {
      setLoggedInUserData(employee)
      setUser('employee')
      localStorage.setItem('loggedInUser', JSON.stringify({ role: 'employee', data: { email: employee.email } }))
    } else {
      alert('Invalid credentials. Please check your email and password.')
    }
  }

  const changeUser = () => {
    setUser(null)
    setLoggedInUserData(null)
    localStorage.removeItem('loggedInUser')
  }

  if (user === 'admin') return <AdminDashboard changeUser={changeUser} data={adminData} />
  if (user === 'employee') {
    const latestEmployee = (userData || []).find(e => e.email === loggedInUserData?.email) || loggedInUserData
    return latestEmployee ? <EmployeeDashboard changeUser={changeUser} data={latestEmployee} /> : <Login handleLogin={handleLogin} />
  }
  return <Login handleLogin={handleLogin} />
}
