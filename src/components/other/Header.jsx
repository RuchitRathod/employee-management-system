import React from 'react'

export default function Header({ changeUser, data }) {
  const logOutUser = () => {
    localStorage.removeItem('loggedInUser')
    changeUser()
  }

  return (
    <header className="flex items-end justify-between gap-4">
      <h1 className="text-2xl font-medium">Hello<br /><span className="text-3xl font-semibold">{data?.firstName || 'User'} 👋</span></h1>
      <button onClick={logOutUser} className="rounded-sm bg-red-600 px-5 py-2 text-base font-medium text-white hover:bg-red-500">Log out</button>
    </header>
  )
}
