import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { graphqlEndpoint } from '../lib/api'

export default function Dashboard(){
  const [memberTeams, setMemberTeams] = useState<any[]>([])
  const [ownedTeams, setOwnedTeams] = useState<any[]>([])
    const [creating, setCreating] = useState(false)
    const [newName, setNewName] = useState('')

  useEffect(()=>{ load(); },[])
  async function load(){
    const m = await fetch(graphqlEndpoint(),{ method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+localStorage.getItem('tt_token')}, body: JSON.stringify({ query: `query{ myMemberTeams{ id name ownerId } }` }) });
    const mo = await m.json(); setMemberTeams(mo.data?.myMemberTeams||[]);
    const o = await fetch(graphqlEndpoint(),{ method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+localStorage.getItem('tt_token')}, body: JSON.stringify({ query: `query{ myOwnedTeams{ id name ownerId } }` }) });
    const oo = await o.json(); setOwnedTeams(oo.data?.myOwnedTeams||[]);
  }

    async function createTeam(){
      if(!newName) return alert('Provide a name')
      setCreating(true)
      try{
        const q = `mutation CreateTeam($name:String!){ createTeam(name:$name){ id name ownerId } }`;
        const res = await fetch(graphqlEndpoint(),{ method:'POST', headers:{ 'Content-Type':'application/json', 'Authorization':'Bearer '+localStorage.getItem('tt_token') }, body: JSON.stringify({ query: q, variables:{ name:newName } }) })
        const j = await res.json()
        if(j.data?.createTeam){ setNewName(''); load() }
        else alert(j.errors?.[0]?.message||'Failed')
      }finally{ setCreating(false) }
    }

    async function deleteTeam(id:string){
      if(!confirm('Delete team? This cannot be undone.')) return
      const q = `mutation DeleteTeam($id:String!){ deleteTeam(id:$id) }`;
      const res = await fetch(graphqlEndpoint(),{ method:'POST', headers:{ 'Content-Type':'application/json', 'Authorization':'Bearer '+localStorage.getItem('tt_token') }, body: JSON.stringify({ query:q, variables:{ id } }) })
      const j = await res.json()
      if(j.data?.deleteTeam) load(); else alert(j.errors?.[0]?.message||'Delete failed')
    }

    return (
      <div>
        <div className="card">
          <h2>Dashboard</h2>
          <div style={{display:'flex',gap:12}}>
            <div style={{flex:1}}>
              <h3>Teams you belong to</h3>
              {memberTeams.map(t=> <div key={t.id}><Link to={`/teams/${t.id}`}>{t.name}</Link></div>)}
            </div>
            <div style={{width:360}}>
              <h3>Your teams (owner)</h3>
              {ownedTeams.map(t=> (
                <div key={t.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <Link to={`/teams/${t.id}`}>{t.name}</Link>
                  <button onClick={()=>deleteTeam(t.id)} style={{marginLeft:8}}>Delete</button>
                </div>
              ))}
              <hr />
              <div>
                <h4>Create Team</h4>
                <input placeholder="Team name" value={newName} onChange={e=>setNewName(e.target.value)} />
                <button onClick={createTeam} disabled={creating} style={{marginTop:8}}>{creating? 'Creating…' : 'Create'}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )

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
