import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'

export default function Signup(){
  const { register, loading } = useAuth()
  const [email,setEmail] = useState('')
  const [name,setName] = useState('')
  const [password,setPassword] = useState('')
  const [error,setError] = useState<string | null>(null)
  const navigate = useNavigate()

  async function submit(e?: React.FormEvent){
    e?.preventDefault()
    setError(null)
    try{
      await register(email,password,name)
      navigate('/login')
    }catch(err:any){
      setError(err.message || 'Register failed')
    }
  }

  return (
    <div className="card">
      <h2>Create account</h2>
      <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:8}}>
        <label>
          Email
          <input placeholder="you@company.com" value={email} onChange={e=>setEmail(e.target.value)} />
        </label>
        <label>
          Name
          <input placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} />
        </label>
        <label>
          Password
          <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </label>
        {error && <div style={{color:'red'}}>{error}</div>}
        <button type="submit" disabled={loading}>{loading? 'Creating…' : 'Create account'}</button>
      </form>
      <div style={{marginTop:12}}>
        Already have an account? <Link to="/login">Sign in</Link>
      </div>
    </div>
  )
}
