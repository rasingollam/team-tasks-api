import React, { useState } from 'react'

import { graphqlEndpoint } from '../lib/api'

export default function Signup(){
  const [email,setEmail] = useState('')
  const [name,setName] = useState('')
  const [password,setPassword] = useState('')

  async function submit(){
    const q = `mutation Register($email:String!,$password:String!,$name:String){ register(email:$email,password:$password,name:$name){ id email name } }`;
    const res = await fetch(graphqlEndpoint(),{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ query: q, variables:{ email, password, name } }) });
    const json = await res.json();
    if (json.data && json.data.register){ alert('Registered — please login'); window.location.href='/login'; }
    else alert(json.errors?.[0]?.message || 'Register failed')
  }

  return (
    <div className="card">
      <h2>Sign up</h2>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button onClick={submit}>Sign up</button>
    </div>
  )
}
