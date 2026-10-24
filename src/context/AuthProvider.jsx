import React, { createContext, useEffect, useState } from 'react'
import { getLocalStorage, setLocalStorage } from '../utils/localStorage'

export const AuthContext = createContext([[], () => {}])

function normalizeEmployees(employees) {
  return employees.map(employee => ({
    ...employee,
    tasks: (employee.tasks || []).map(task => {
      const status = task.completed ? 'completed' : task.failed ? 'failed' : task.active ? 'active' : 'new'
      return {
        ...task,
        id: task.id || (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`),
        priority: task.priority || 'medium',
        createdAt: task.createdAt || new Date().toISOString(),
        active: status === 'active',
        newTask: status === 'new',
        completed: status === 'completed',
        failed: status === 'failed'
      }
    })
  }))
}

export default function AuthProvider({ children }) {
  const [userData, setUserData] = useState(() => {
    const stored = getLocalStorage()
    const initialEmployees = stored.employees || setLocalStorage().employees
    return normalizeEmployees(initialEmployees)
  })

  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(userData))
  }, [userData])

  return (
    <AuthContext.Provider value={[userData, setUserData]}>
      {children}
    </AuthContext.Provider>
  )
}
