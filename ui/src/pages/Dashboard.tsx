import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Dashboard(){
  const [memberTeams, setMemberTeams] = useState<any[]>([])
  const [ownedTeams, setOwnedTeams] = useState<any[]>([])

  useEffect(()=>{ load(); },[])
  async function load(){
    const m = await fetch('/graphql',{ method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+localStorage.getItem('tt_token')}, body: JSON.stringify({ query: `query{ myMemberTeams{ id name ownerId } }` }) });
    const mo = await m.json(); setMemberTeams(mo.data?.myMemberTeams||[]);
    const o = await fetch('/graphql',{ method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+localStorage.getItem('tt_token')}, body: JSON.stringify({ query: `query{ myOwnedTeams{ id name ownerId } }` }) });
    const oo = await o.json(); setOwnedTeams(oo.data?.myOwnedTeams||[]);
  }

  return (
    <div className="card">
      <h2>Dashboard</h2>
      <div style={{display:'flex',gap:12}}>
        <div style={{flex:1}}>
          <h3>Teams you belong to</h3>
          {memberTeams.map(t=> <div key={t.id}><Link to={`/teams/${t.id}`}>{t.name}</Link></div>)}
        </div>
        <div style={{width:300}}>
          <h3>Your teams (owner)</h3>
          {ownedTeams.map(t=> <div key={t.id}><Link to={`/teams/${t.id}`}>{t.name}</Link></div>)}
        </div>
      </div>
    </div>
  )
}
