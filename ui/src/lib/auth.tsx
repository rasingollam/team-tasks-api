import React, { createContext, useContext, useEffect, useState } from 'react'
import { graphqlEndpoint } from './api'

type User = { id: string; email: string; name?: string } | null

type AuthContextValue = {
  user: User
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (email: string, password: string, name?: string) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }){
  const [user, setUser] = useState<User>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('tt_token'))
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    if(token){
      // try to fetch self user
      fetch(graphqlEndpoint(),{ method:'POST', headers:{ 'Content-Type':'application/json', 'Authorization':'Bearer '+token }, body: JSON.stringify({ query:`query{ me{ id email name } }` }) })
        .then(r=>r.json())
        .then(j=>{ if(j.data?.me) setUser(j.data.me); else { setUser(null); setToken(null); localStorage.removeItem('tt_token') } })
        .catch(()=>{ setUser(null); setToken(null); localStorage.removeItem('tt_token') })
    }
  },[token])

  async function login(email:string,password:string){
    setLoading(true)
    try{
      const q = `mutation Login($email:String!,$password:String!){ login(email:$email,password:$password){ token user{ id email name } } }`;
      const res = await fetch(graphqlEndpoint(),{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ query:q, variables:{ email, password } }) })
      const j = await res.json();
      if(j.data?.login){ const t = j.data.login.token; localStorage.setItem('tt_token', t); setToken(t); setUser(j.data.login.user); }
      else throw new Error(j.errors?.[0]?.message || 'Login failed')
    }finally{ setLoading(false) }
  }

  async function register(email:string,password:string,name?:string){
    setLoading(true)
    try{
      const q = `mutation Register($email:String!,$password:String!,$name:String){ register(email:$email,password:$password,name:$name){ id email name } }`;
      const res = await fetch(graphqlEndpoint(),{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ query:q, variables:{ email, password, name } }) })
      const j = await res.json();
      if(j.data?.register){ /* registered */ }
      else throw new Error(j.errors?.[0]?.message || 'Register failed')
    }finally{ setLoading(false) }
  }

  function logout(){ localStorage.removeItem('tt_token'); setToken(null); setUser(null) }

  return <AuthContext.Provider value={{ user, token, loading, login, logout, register }}>{children}</AuthContext.Provider>
}

export function useAuth(){ const ctx = useContext(AuthContext); if(!ctx) throw new Error('useAuth must be used within AuthProvider'); return ctx }
