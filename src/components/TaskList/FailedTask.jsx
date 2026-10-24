import React from 'react'
export default function FailedTask({ data, onStatusChange }) {
  return <article className="task-card"><div className="task-card-top"><span className="category-tag">{data.category || 'General'}</span><span className="status-pill status-failed">Failed</span></div><h3>{data.taskTitle}</h3><p className="task-description">{data.taskDescription}</p><div className="task-card-bottom"><div><div className={`priority-pill priority-${data.priority || 'medium'}`}>{(data.priority || 'medium').toUpperCase()} PRIORITY</div><div className="task-date" style={{ marginTop: 6 }}>Due {data.taskDate || 'Not set'}</div></div><div className="task-actions"><button className="btn" onClick={() => onStatusChange('active')}>↻ Retry task</button></div></div></article>
}
