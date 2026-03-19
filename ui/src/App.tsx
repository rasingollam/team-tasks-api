import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import TeamPage from './pages/TeamPage'
import { useAuth } from './lib/auth'

function Header(){
  const { user, logout } = useAuth()
  return (
    <header className="app-header">
      <a href="/">Team Tasks</a>
      <nav>
        <a href="/dashboard">Dashboard</a>
        {user ? <button onClick={logout}>Logout</button> : <a href="/login">Login</a>}
      </nav>
    </header>
  )
}

export default function App(){
  const { user } = useAuth()
  return (
    <div>
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/teams/:id" element={<TeamPage/>} />
        </Routes>
      </main>
    </div>
  )
}
