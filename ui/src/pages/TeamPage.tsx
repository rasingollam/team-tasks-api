import React, { useEffect, useState } from 'react'
import { graphqlEndpoint } from '../lib/api'
import { useParams } from 'react-router-dom'

export default function TeamPage(){
  const { id } = useParams();
  const [team, setTeam] = useState<any>(null)
  const [members, setMembers] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [allUsers, setAllUsers] = useState<any[]>([])
  const [selectedUserToAdd, setSelectedUserToAdd] = useState<string>('')

  useEffect(()=>{ if(id) load(); },[id])

  async function load(){
    if(!id) return
    const headers = { 'Content-Type':'application/json', 'Authorization':'Bearer '+localStorage.getItem('tt_token') }
    const t = await fetch(graphqlEndpoint(),{ method:'POST', headers, body: JSON.stringify({ query: `query Team($id:String!){ team(id:$id){ id name ownerId } }`, variables:{ id } }) });
    const tj = await t.json(); setTeam(tj.data?.team||null);
    const m = await fetch(graphqlEndpoint(),{ method:'POST', headers, body: JSON.stringify({ query: `query TeamMembers($teamId:String!){ teamMembers(teamId:$teamId){ id name email } }`, variables:{ teamId:id } }) });
    const mj = await m.json(); setMembers(mj.data?.teamMembers||[]);
    // fetch all users for selection
    const u = await fetch(graphqlEndpoint(),{ method:'POST', headers, body: JSON.stringify({ query: `query{ users{ id email name } }` }) });
    const uj = await u.json(); setAllUsers(uj.data?.users||[]);
    const ta = await fetch(graphqlEndpoint(),{ method:'POST', headers, body: JSON.stringify({ query: `query TasksByTeam($teamId:String!){ tasksByTeam(teamId:$teamId){ id title description status assignedTo } }`, variables:{ teamId:id } }) });
    const taj = await ta.json(); setTasks(taj.data?.tasksByTeam||[]);
  }

  async function createTask(){
    if(!id) return
    const title = prompt('Task title')
    if(!title) return
    const q = `mutation CreateTask($teamId:String!,$title:String!,$description:String){ createTask(teamId:$teamId,title:$title,description:$description){ id } }`;
    const res = await fetch(graphqlEndpoint(),{ method:'POST', headers:{ 'Content-Type':'application/json', 'Authorization':'Bearer '+localStorage.getItem('tt_token') }, body: JSON.stringify({ query: q, variables:{ teamId:id, title, description:'' } }) })
    const j = await res.json(); if(j.data?.createTask) load(); else alert(j.errors?.[0]?.message||'Create failed')
  }

  async function addMember(){
    if(!id) return
    const userId = selectedUserToAdd
    if(!userId) return alert('Select a user to add')
    const q = `mutation AddMember($teamId:String!,$userId:String!){ addMember(teamId:$teamId,userId:$userId){ id userId teamId } }`;
    const res = await fetch(graphqlEndpoint(),{ method:'POST', headers:{ 'Content-Type':'application/json', 'Authorization':'Bearer '+localStorage.getItem('tt_token') }, body: JSON.stringify({ query:q, variables:{ teamId:id, userId } }) })
    const j = await res.json(); if(j.data?.addMember) { setSelectedUserToAdd(''); load(); } else alert(j.errors?.[0]?.message||'Add failed')
  }

  async function removeMember(userId:string){
    if(!id) return
    if(!confirm('Remove member from team?')) return
    const q = `mutation RemoveMember($teamId:String!,$userId:String!){ removeMember(teamId:$teamId,userId:$userId) }`;
    const res = await fetch(graphqlEndpoint(),{ method:'POST', headers:{ 'Content-Type':'application/json', 'Authorization':'Bearer '+localStorage.getItem('tt_token') }, body: JSON.stringify({ query:q, variables:{ teamId:id, userId } }) })
    const j = await res.json(); if(j.data?.removeMember) load(); else alert(j.errors?.[0]?.message||'Remove failed')
  }

  async function assignTask(taskId:string, userId:string){
    if(!id) return
    if(!userId) return
    const q = `mutation AssignTask($taskId:String!,$userId:String!){ assignTask(taskId:$taskId,userId:$userId){ id assignedTo } }`;
    const res = await fetch(graphqlEndpoint(),{ method:'POST', headers:{ 'Content-Type':'application/json', 'Authorization':'Bearer '+localStorage.getItem('tt_token') }, body: JSON.stringify({ query:q, variables:{ taskId, userId } }) })
    const j = await res.json(); if(j.data?.assignTask) load(); else alert(j.errors?.[0]?.message||'Assign failed')
  }

  async function removeAssignment(taskId:string){
    if(!id) return
    const q = `mutation RemoveAssignment($taskId:String!){ removeTaskAssignment(taskId:$taskId){ id assignedTo } }`;
    const res = await fetch(graphqlEndpoint(),{ method:'POST', headers:{ 'Content-Type':'application/json', 'Authorization':'Bearer '+localStorage.getItem('tt_token') }, body: JSON.stringify({ query:q, variables:{ taskId } }) })
    const j = await res.json(); if(j.data?.removeTaskAssignment) load(); else alert(j.errors?.[0]?.message||'Remove failed')
  }

  async function deleteTask(taskId:string){
    if(!id) return
    if(!confirm('Delete task?')) return
    const q = `mutation DeleteTask($taskId:String!){ deleteTask(taskId:$taskId) }`;
    const res = await fetch(graphqlEndpoint(),{ method:'POST', headers:{ 'Content-Type':'application/json', 'Authorization':'Bearer '+localStorage.getItem('tt_token') }, body: JSON.stringify({ query:q, variables:{ taskId } }) })
    const j = await res.json(); if(j.data?.deleteTask) load(); else alert(j.errors?.[0]?.message||'Delete failed')
  }

  async function updateTask(task:any){
    if(!id) return
    const title = prompt('Title', task.title) || undefined
    const description = prompt('Description', task.description) || undefined
    const status = prompt('Status (TODO, IN_PROGRESS, DONE)', task.status) || undefined
    const q = `mutation UpdateTask($taskId:String!,$title:String,$description:String,$status:TaskStatus,$assignedTo:String){ updateTask(taskId:$taskId,title:$title,description:$description,status:$status,assignedTo:$assignedTo){ id title description status assignedTo } }`;
    const res = await fetch(graphqlEndpoint(),{ method:'POST', headers:{ 'Content-Type':'application/json', 'Authorization':'Bearer '+localStorage.getItem('tt_token') }, body: JSON.stringify({ query:q, variables:{ taskId:task.id, title, description, status, assignedTo: task.assignedTo } }) })
    const j = await res.json(); if(j.data?.updateTask) load(); else alert(j.errors?.[0]?.message||'Update failed')
  }

  return (
    <div className="card">
      <h2>Team {team?.name}</h2>
      <div style={{display:'flex',gap:12}}>
        <div style={{flex:1}}>
          <h3>Members</h3>
          <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:8}}>
            <select value={selectedUserToAdd} onChange={e=>setSelectedUserToAdd(e.target.value)}>
              <option value="">-- select user to add --</option>
              {allUsers.filter(u=>!members.find(m=>m.id===u.id)).map(u=> (
                <option key={u.id} value={u.id}>{u.name||u.email} ({u.email})</option>
              ))}
            </select>
            <button onClick={addMember}>Add member</button>
          </div>
          <ul>
            {members.map(m=> (
              <li key={m.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>{m.name||m.email} <small style={{opacity:0.7}}>({m.id})</small></div>
                <div>
                  <button onClick={()=>removeMember(m.id)} style={{marginLeft:8}}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div style={{width:420}}>
          <h3>Tasks</h3>
          <button onClick={createTask}>Create Task</button>
          <ul>
            {tasks.map(t=> (
              <li key={t.id} style={{marginBottom:8}}>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                  <div>
                    <strong>{t.title}</strong> — <em>{t.status}</em>
                    <div style={{opacity:0.8}}>{t.description}</div>
                    <div style={{fontSize:12}}>{t.assignedTo? `Assigned: ${t.assignedTo}` : 'Unassigned'}</div>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:6}}>
                    <div style={{display:'flex',gap:8}}>
                      <select defaultValue={t.assignedTo||''} onChange={e=>assignTask(t.id,e.target.value)}>
                        <option value="">-- assign --</option>
                        {allUsers.map(u=> <option key={u.id} value={u.id}>{u.name||u.email}</option>)}
                      </select>
                      <button onClick={()=>removeAssignment(t.id)}>Unassign</button>
                    </div>
                    <button onClick={()=>updateTask(t)}>Update</button>
                    <button onClick={()=>deleteTask(t.id)} style={{color:'red'}}>Delete</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
