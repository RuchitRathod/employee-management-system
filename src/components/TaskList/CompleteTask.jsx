import React from 'react'
export default function CompleteTask({ data }) {
  return <article className="task-card"><div className="task-card-top"><span className="category-tag">{data.category || 'General'}</span><span className="status-pill status-completed">Completed</span></div><h3>{data.taskTitle}</h3><p className="task-description">{data.taskDescription}</p><div className="task-card-bottom"><div><div className={`priority-pill priority-${data.priority || 'medium'}`}>{(data.priority || 'medium').toUpperCase()} PRIORITY</div><div className="task-date" style={{ marginTop: 6 }}>Due {data.taskDate || 'Not set'}</div></div><span className="metric-green" aria-label="Completed">✓ Done</span></div></article>
}
