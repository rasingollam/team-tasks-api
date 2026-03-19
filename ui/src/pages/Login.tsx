import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'

export default function Login(){
  const { login, loading } = useAuth()
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [error,setError] = useState<string | null>(null)
  const navigate = useNavigate()

  async function submit(e?: React.FormEvent){
    e?.preventDefault()
    setError(null)
    try{
      await login(email,password)
      navigate('/dashboard')
    }catch(err:any){
      setError(err.message || 'Login failed')
    }
  }

  return (
    <div className="card">
      <h2>Login</h2>
      <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:8}}>
        <label>
          Email
          <input placeholder="you@company.com" value={email} onChange={e=>setEmail(e.target.value)} />
        </label>
        <label>
          Password
          <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </label>
        {error && <div style={{color:'red'}}>{error}</div>}
        <button type="submit" disabled={loading}>{loading? 'Signing in…' : 'Sign in'}</button>
      </form>
      <div style={{marginTop:12}}>
        Don't have an account? <Link to="/signup">Create one</Link>
      </div>
    </div>
  )
}
