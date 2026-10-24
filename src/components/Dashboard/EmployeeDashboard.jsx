import React, { useContext, useMemo, useState } from 'react'
import { AuthContext } from '../../context/AuthProvider'
import TaskList from '../TaskList/TaskList'

export default function EmployeeDashboard({ changeUser, data }) {
  const [userData] = useContext(AuthContext)
  const [activeView, setActiveView] = useState('overview')
  const employeeData = userData?.find(employee => employee.email === data?.email) || data
  const tasks = employeeData?.tasks || []
  const firstName = employeeData?.firstName || 'there'
  const counts = useMemo(() => tasks.reduce((acc, task) => { const status = task.completed ? 'completed' : task.failed ? 'failed' : task.active ? 'active' : 'newTask'; acc[status] += 1; return acc }, { newTask: 0, active: 0, completed: 0, failed: 0 }), [tasks])

  return <div className="app-shell app-layout">
    <aside className="sidebar"><div className="brand"><div className="brand-mark">E</div><div><div className="brand-name">ember<span style={{ color: '#3fb950' }}>.</span></div><div className="brand-caption">MY WORKSPACE</div></div></div><div><div className="side-label">My workspace</div><nav className="side-nav"><button className={`side-link ${activeView === 'overview' ? 'active' : ''}`} onClick={() => setActiveView('overview')}><span className="side-icon">▦</span>My dashboard</button><button className={`side-link ${activeView === 'tasks' ? 'active' : ''}`} onClick={() => setActiveView('tasks')}><span className="side-icon">☷</span>My tasks <span className="nav-count">{tasks.length}</span></button></nav></div><div className="sidebar-bottom"><strong>Stay on track</strong><span>Keep an eye on due dates and update task statuses as you make progress.</span></div></aside>
    <main className="main-area"><header className="topbar"><div><div className="eyebrow">My workspace / {activeView === 'overview' ? 'Overview' : 'My tasks'}</div><h1 className="page-title">{activeView === 'overview' ? `Good to see you, ${firstName}` : 'My tasks'}</h1><p className="page-subtitle">{activeView === 'overview' ? "Here is what's happening with your tasks today." : 'Review your assignments, search, and update your progress.'}</p></div><div className="user-area"><div className="avatar">{firstName.slice(0,1).toUpperCase()}</div><div className="user-meta"><div className="user-name">{firstName}</div><div className="user-role">Team member</div></div><button className="btn logout-btn" onClick={changeUser}>Log out ↗</button></div></header>
      {activeView === 'overview' && <><div className="metric-grid"><Metric label="New tasks" value={counts.newTask} tone="blue" icon="✦" foot="Waiting for you"/><Metric label="In progress" value={counts.active} tone="amber" icon="◷" foot="Work in progress"/><Metric label="Completed" value={counts.completed} tone="green" icon="✓" foot="Tasks finished"/><Metric label="Failed" value={counts.failed} tone="red" icon="!" foot="Review or retry"/></div><div className="section-heading">Your task list <span className="muted" style={{ fontFamily: 'DM Sans', fontSize: 12, fontWeight: 400 }}>· {tasks.length} total</span><button className="btn" onClick={() => setActiveView('tasks')}>View all tasks →</button></div><TaskList data={employeeData} compact /></>}
      {activeView === 'tasks' && <><div className="metric-grid compact-metrics"><Metric label="New" value={counts.newTask} tone="blue" icon="✦" foot="Ready to start"/><Metric label="In progress" value={counts.active} tone="amber" icon="◷" foot="Currently working"/><Metric label="Completed" value={counts.completed} tone="green" icon="✓" foot="Finished"/><Metric label="Failed" value={counts.failed} tone="red" icon="!" foot="Can be retried"/></div><TaskList data={employeeData}/></>}
      <footer className="muted" style={{ fontSize: 11, paddingTop: 28 }}>Ember workspace · Your task changes are saved in this browser.</footer>
    </main>
  </div>
}
function Metric({ label, value, tone, icon, foot }) { return <div className="metric-card"><div className="metric-top"><span>{label}</span><span className="metric-icon">{icon}</span></div><div className={`metric-value metric-${tone}`}>{value}</div><div className="metric-foot">{foot}</div></div> }
