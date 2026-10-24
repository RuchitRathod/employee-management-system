import React, { useContext, useMemo, useState } from 'react'
import { AuthContext } from '../../context/AuthProvider'
import Header from '../other/Header'
import CreateTask from '../other/CreateTask'
import CreateEmployee from '../other/CreateEmployee'
import AllTask from '../other/AllTask'

const nav = [{ id: 'overview', icon: '▦', label: 'Overview' }, { id: 'tasks', icon: '☷', label: 'Task management' }, { id: 'employees', icon: '♙', label: 'Employees' }]

export default function AdminDashboard({ changeUser, data }) {
  const [employees] = useContext(AuthContext)
  const [activeView, setActiveView] = useState('overview')
  const [showCreate, setShowCreate] = useState(false)
  const tasks = useMemo(() => employees.flatMap(employee => (employee.tasks || []).map(task => ({ ...task, employeeName: employee.firstName }))), [employees])
  const counts = tasks.reduce((acc, task) => {
    const status = task.completed ? 'completed' : task.failed ? 'failed' : task.active ? 'active' : 'new'
    acc[status] += 1
    return acc
  }, { new: 0, active: 0, completed: 0, failed: 0 })
  const completion = tasks.length ? Math.round(counts.completed / tasks.length * 100) : 0
  const firstName = data?.firstName || 'Admin'
  const initials = firstName.slice(0, 1).toUpperCase()

  return <div className="app-shell app-layout">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark">E</div><div><div className="brand-name">ember<span style={{ color: '#3fb950' }}>.</span></div><div className="brand-caption">WORKSPACE</div></div></div>
      <div><div className="side-label">Workspace</div><nav className="side-nav">{nav.map(item => <button key={item.id} onClick={() => setActiveView(item.id)} className={`side-link ${activeView === item.id ? 'active' : ''}`}><span className="side-icon">{item.icon}</span>{item.label}</button>)}</nav></div>
      <div><div className="side-label">Account</div><nav className="side-nav"><button className="side-link" onClick={changeUser}><span className="side-icon">↪</span>Log out</button></nav></div>
      <div className="sidebar-bottom"><strong>Workspace overview</strong><span>{employees.length} employees · {tasks.length} tasks tracked. Keep the team moving with a clear view of the work.</span></div>
    </aside>
    <main className="main-area">
      <header className="topbar"><div><div className="eyebrow">Workspace / {nav.find(item => item.id === activeView)?.label}</div><h1 className="page-title">{activeView === 'overview' ? 'Overview' : activeView === 'tasks' ? 'Task management' : 'Employees'}</h1><p className="page-subtitle">A clear view of work, people and progress.</p></div><div className="user-area"><div className="avatar">{initials}</div><div className="user-meta"><div className="user-name">{firstName}</div><div className="user-role">Administrator</div></div><button className="btn logout-btn" onClick={changeUser}>Log out ↗</button></div></header>
      {activeView === 'overview' && <>
        <div className="metric-grid">
          <Metric label="Total tasks" value={tasks.length} icon="☷" tone="blue" foot="Across all employees" />
          <Metric label="In progress" value={counts.active} icon="◷" tone="amber" foot="Currently being worked on" />
          <Metric label="Completed" value={counts.completed} icon="✓" tone="green" foot={`${completion}% overall completion`} />
          <Metric label="Needs attention" value={counts.failed + tasks.filter(task => !task.completed && task.taskDate && task.taskDate < new Date().toISOString().slice(0, 10)).length} icon="!" tone="red" foot="Failed or overdue tasks" />
        </div>
        <div className="dashboard-grid">
          <section className="panel"><div className="panel-header"><div><div className="panel-title">Task progress</div><div className="panel-description">Current status distribution</div></div><span className="status-pill status-completed">Live overview</span></div><div className="panel-body" style={{ display: 'grid', gap: 17 }}>{[['New tasks', counts.new, 'status-new', '#58a6ff'], ['Active', counts.active, 'status-active', '#d29922'], ['Completed', counts.completed, 'status-completed', '#3fb950'], ['Failed', counts.failed, 'status-failed', '#f85149']].map(([label, value, cls, color]) => <div key={label}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}><span className={`status-pill ${cls}`}>{label}</span><strong>{value}</strong></div><div className="progress-track"><div className="progress-fill" style={{ width: `${tasks.length ? value / tasks.length * 100 : 0}%`, background: color }} /></div></div>)}</div></section>
          <section className="panel"><div className="panel-header"><div><div className="panel-title">Team snapshot</div><div className="panel-description">Task distribution by employee</div></div></div><div className="table-wrap"><table><thead><tr><th>Employee</th><th>Tasks</th><th>Done</th></tr></thead><tbody>{employees.slice(0, 6).map(employee => { const total = employee.tasks?.length || 0; const done = employee.tasks?.filter(task => task.completed).length || 0; return <tr key={employee.email}><td><div className="employee-cell"><div className="mini-avatar">{employee.firstName?.slice(0, 1)}</div><span>{employee.firstName}</span></div></td><td>{total}</td><td className="metric-green">{done}</td></tr> })}</tbody></table></div></section>
        </div>
        <div className="section-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}><span>Manage your workspace</span><button className="btn btn-primary" onClick={() => setShowCreate(value => !value)}>{showCreate ? 'Close form' : '+ Create task'}</button></div>
        {showCreate && <div className="panel" style={{ marginBottom: 18 }}><div className="panel-header"><div><div className="panel-title">Create a task</div><div className="panel-description">Assign work to a team member.</div></div><button className="btn" onClick={() => setShowCreate(false)}>Close</button></div><div className="panel-body"><CreateTask /></div></div>}
        <AllTask />
      </>}
      {activeView === 'tasks' && <><div className="panel" style={{ marginBottom: 18 }}><div className="panel-header"><div><div className="panel-title">Create a task</div><div className="panel-description">Assign work to a team member.</div></div></div><div className="panel-body"><CreateTask /></div></div><AllTask /></>}
      {activeView === 'employees' && <><section className="panel employee-create-panel"><div className="panel-header"><div><div className="panel-title">Add an employee</div><div className="panel-description">Create an employee login so they can access their own dashboard.</div></div><span className="status-pill status-completed">Admin action</span></div><div className="panel-body"><CreateEmployee /></div></section><section className="panel" style={{ marginTop: 18 }}><div className="panel-header"><div><div className="panel-title">Employees</div><div className="panel-description">A summary of each employee's current workload.</div></div><span className="muted" style={{fontSize:11}}>{employees.length} accounts</span></div><div className="table-wrap"><table><thead><tr><th>Employee</th><th>Email</th><th>Total tasks</th><th>Active</th><th>Completed</th><th>Failed</th></tr></thead><tbody>{employees.map(employee => { const list = employee.tasks || []; return <tr key={employee.email}><td><div className="employee-cell"><div className="mini-avatar">{employee.firstName?.slice(0,1)}</div><strong>{employee.firstName}</strong></div></td><td className="muted">{employee.email}</td><td>{list.length}</td><td className="metric-amber">{list.filter(task => task.active).length}</td><td className="metric-green">{list.filter(task => task.completed).length}</td><td className="metric-red">{list.filter(task => task.failed).length}</td></tr>})}</tbody></table></div></section></>}
      <footer className="muted" style={{ fontSize: 11, paddingTop: 28 }}>Ember workspace · Demo data is stored in this browser.</footer>
    </main>
  </div>
}

function Metric({ label, value, icon, tone, foot }) { return <div className="metric-card"><div className="metric-top"><span>{label}</span><span className="metric-icon">{icon}</span></div><div className={`metric-value metric-${tone}`}>{value}</div><div className="metric-foot">{foot}</div></div> }
