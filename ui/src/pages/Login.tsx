import React, { useState } from 'react'

import { graphqlEndpoint } from '../lib/api'

export default function Login(){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')

  async function submit(){
    const q = `mutation Login($email:String!,$password:String!){ login(email:$email,password:$password){ token user{ id email name } } }`;
    const res = await fetch(graphqlEndpoint(),{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ query: q, variables:{ email, password } }) });
    const json = await res.json();
    if (json.data && json.data.login){ localStorage.setItem('tt_token', json.data.login.token); alert('Logged in'); window.location.href='/dashboard'; }
    else alert(json.errors?.[0]?.message || 'Login failed')
  }

  return (
    <div className="card">
      <h2>Login</h2>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button onClick={submit}>Login</button>
    </div>
  )
}
