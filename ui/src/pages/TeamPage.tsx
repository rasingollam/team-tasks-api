import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function TeamPage(){
  const { id } = useParams();
  const [team, setTeam] = useState<any>(null)
  const [members, setMembers] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  useEffect(()=>{ if(id) load(); },[id])
  async function load(){
    const t = await fetch('/graphql',{ method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+localStorage.getItem('tt_token')}, body: JSON.stringify({ query: `query Team($id:String!){ team(id:$id){ id name ownerId } }`, variables:{ id } }) });
    const tj = await t.json(); setTeam(tj.data?.team||null);
    const m = await fetch('/graphql',{ method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+localStorage.getItem('tt_token')}, body: JSON.stringify({ query: `query TeamMembers($teamId:String!){ teamMembers(teamId:$teamId){ id name email } }`, variables:{ teamId:id } }) });
    const mj = await m.json(); setMembers(mj.data?.teamMembers||[]);
    const ta = await fetch('/graphql',{ method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+localStorage.getItem('tt_token')}, body: JSON.stringify({ query: `query TasksByTeam($teamId:String!){ tasksByTeam(teamId:$teamId){ id title description status assignedTo } }`, variables:{ teamId:id } }) });
    const taj = await ta.json(); setTasks(taj.data?.tasksByTeam||[]);
  }

  async function createTask(){ const title = prompt('Task title'); if(!title) return; await fetch('/graphql',{ method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+localStorage.getItem('tt_token')}, body: JSON.stringify({ query: `mutation CreateTask($teamId:String!,$title:String!,$description:String){ createTask(teamId:$teamId,title:$title,description:$description){ id } }`, variables:{ teamId:id, title, description:'' } }) }); load(); }

  return (
    <div className="card">
      <h2>Team {team?.name}</h2>
      <button onClick={createTask}>Create Task</button>
      <h3>Members</h3>
      <ul>{members.map(m=> <li key={m.id}>{m.name||m.email} ({m.id})</li>)}</ul>
      <h3>Tasks</h3>
      <ul>{tasks.map(t=> <li key={t.id}><strong>{t.title}</strong> — {t.status} {t.assignedTo?`(assigned to ${t.assignedTo})`:''}</li>)}</ul>
    </div>
  )
}
