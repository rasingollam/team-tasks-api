const apiPath = '/graphql';
const output = document.getElementById('output');
const tokenInput = document.getElementById('token');
const saveToken = document.getElementById('saveToken');
const clearToken = document.getElementById('clearToken');
const menu = document.getElementById('menu');
const forms = document.getElementById('forms');

// Persist token
if (localStorage.getItem('tt_token')) tokenInput.value = localStorage.getItem('tt_token');
saveToken.onclick = () => { localStorage.setItem('tt_token', tokenInput.value); alert('Token saved'); };
clearToken.onclick = () => { localStorage.removeItem('tt_token'); tokenInput.value=''; alert('Token cleared'); };

menu.onclick = (e) => {
  const a = e.target && e.target.dataset && e.target.dataset.action;
  if (a) showPanel(a);
};

function showPanel(name){
  forms.innerHTML = '';
  switch(name){
    case 'register': buildRegister(); break;
    case 'login': buildLogin(); break;
    case 'teams': buildTeams(); break;
    case 'members': buildMembers(); break;
    case 'tasks': buildTasks(); break;
    case 'me': buildMe(); break;
    default: buildMe();
  }
}

function sendGraphQL(query, variables){
  const token = localStorage.getItem('tt_token');
  return fetch(apiPath, {
    method:'POST',
    headers: Object.assign({'Content-Type':'application/json'}, token?{'Authorization':'Bearer '+token}:{}),
    body: JSON.stringify({ query, variables })
  }).then(r=>r.json()).then(renderResult).catch(err=>{ output.textContent = err; });
}

function renderResult(json){ output.textContent = JSON.stringify(json, null, 2); }

// UI builders
function buildCard(title){ const c = document.createElement('div'); c.className='form-card'; const h = document.createElement('h3'); h.textContent = title; c.appendChild(h); return c; }

function buildRegister(){
  const card = buildCard('Register');
  const email = document.createElement('input'); email.placeholder='Email';
  const name = document.createElement('input'); name.placeholder='Name';
  const pass = document.createElement('input'); pass.placeholder='Password'; pass.type='password';
  const btn = document.createElement('button'); btn.textContent='Register';
  btn.onclick = () => {
    const q = `mutation Register($email:String!, $password:String!, $name:String){ register(email:$email,password:$password,name:$name){ id email name } }`;
    sendGraphQL(q,{ email: email.value, password: pass.value, name: name.value });
  };
  const r = document.createElement('div'); r.className='form-row'; r.appendChild(email); r.appendChild(name); r.appendChild(pass); r.appendChild(btn);
  card.appendChild(r); forms.appendChild(card);
}

function buildLogin(){
  const card = buildCard('Login');
  const email = document.createElement('input'); email.placeholder='Email';
  const pass = document.createElement('input'); pass.placeholder='Password'; pass.type='password';
  const btn = document.createElement('button'); btn.textContent='Login';
  btn.onclick = async () => {
    const q = `mutation Login($email:String!, $password:String!){ login(email:$email,password:$password){ token user{ id email name } } }`;
    const res = await sendGraphQL(q,{ email: email.value, password: pass.value });
    if (res && res.data && res.data.login && res.data.login.token){ localStorage.setItem('tt_token', res.data.login.token); tokenInput.value = res.data.login.token; alert('Logged in'); }
  };
  const r = document.createElement('div'); r.className='form-row'; r.appendChild(email); r.appendChild(pass); r.appendChild(btn);
  card.appendChild(r); forms.appendChild(card);
}

function buildTeams(){
  // Create Team
  const create = buildCard('Create Team');
  const name = document.createElement('input'); name.placeholder='Team name';
  const btn = document.createElement('button'); btn.textContent='Create';
  btn.onclick = () => {
    const q = `mutation CreateTeam($name:String!){ createTeam(name:$name){ id name ownerId } }`;
    sendGraphQL(q,{ name: name.value });
  };
  const r = document.createElement('div'); r.className='form-row'; r.appendChild(name); r.appendChild(btn); create.appendChild(r); forms.appendChild(create);

  // My Owned Teams
  const owned = buildCard('My Owned Teams');
  const btn2 = document.createElement('button'); btn2.textContent='Load';
  btn2.onclick = () => sendGraphQL(`query{ myOwnedTeams{ id name ownerId } }`,{});
  owned.appendChild(btn2); forms.appendChild(owned);

  // My Member Teams
  const mem = buildCard('My Member Teams');
  const btn3 = document.createElement('button'); btn3.textContent='Load';
  btn3.onclick = () => sendGraphQL(`query{ myMemberTeams{ id name ownerId } }`,{});
  mem.appendChild(btn3); forms.appendChild(mem);
}

function buildMembers(){
  const get = buildCard('Get Team Members');
  const teamId = document.createElement('input'); teamId.placeholder='Team ID';
  const btn = document.createElement('button'); btn.textContent='Load';
  btn.onclick = () => sendGraphQL(`query TeamMembers($teamId:String!){ teamMembers(teamId:$teamId){ id email name } }`,{ teamId: teamId.value });
  const r = document.createElement('div'); r.className='form-row'; r.appendChild(teamId); r.appendChild(btn); get.appendChild(r); forms.appendChild(get);

  const add = buildCard('Add Member');
  const aTeam = document.createElement('input'); aTeam.placeholder='Team ID';
  const aUser = document.createElement('input'); aUser.placeholder='User ID';
  const addBtn = document.createElement('button'); addBtn.textContent='Add';
  addBtn.onclick = () => sendGraphQL(`mutation AddMember($teamId:String!,$userId:String!){ addMember(teamId:$teamId,userId:$userId){ id userId teamId } }`,{ teamId: aTeam.value, userId: aUser.value });
  const row = document.createElement('div'); row.className='form-row'; row.appendChild(aTeam); row.appendChild(aUser); row.appendChild(addBtn); add.appendChild(row); forms.appendChild(add);

  const addMany = buildCard('Add Multiple Members');
  const amTeam = document.createElement('input'); amTeam.placeholder='Team ID';
  const amUsers = document.createElement('input'); amUsers.placeholder='Comma-separated user IDs';
  const amBtn = document.createElement('button'); amBtn.textContent='Add Many';
  amBtn.onclick = () => {
    const ids = amUsers.value.split(',').map(s=>s.trim()).filter(Boolean);
    sendGraphQL(`mutation AddMembers($teamId:String!,$userIds:[String!]!){ addMembers(teamId:$teamId,userIds:$userIds){ id userId teamId } }`,{ teamId: amTeam.value, userIds: ids });
  };
  const row2 = document.createElement('div'); row2.className='form-row'; row2.appendChild(amTeam); row2.appendChild(amUsers); row2.appendChild(amBtn); addMany.appendChild(row2); forms.appendChild(addMany);

  const remove = buildCard('Remove Member');
  const rTeam = document.createElement('input'); rTeam.placeholder='Team ID';
  const rUser = document.createElement('input'); rUser.placeholder='User ID';
  const rBtn = document.createElement('button'); rBtn.textContent='Remove';
  rBtn.onclick = () => sendGraphQL(`mutation RemoveMember($teamId:String!,$userId:String!){ removeMember(teamId:$teamId,userId:$userId) }`,{ teamId: rTeam.value, userId: rUser.value });
  const row3 = document.createElement('div'); row3.className='form-row'; row3.appendChild(rTeam); row3.appendChild(rUser); row3.appendChild(rBtn); remove.appendChild(row3); forms.appendChild(remove);
}

function buildTasks(){
  const create = buildCard('Create Task');
  const tTeam = document.createElement('input'); tTeam.placeholder='Team ID';
  const tTitle = document.createElement('input'); tTitle.placeholder='Title';
  const tDesc = document.createElement('input'); tDesc.placeholder='Description';
  const tBtn = document.createElement('button'); tBtn.textContent='Create';
  tBtn.onclick = () => sendGraphQL(`mutation CreateTask($teamId:String!,$title:String!,$description:String){ createTask(teamId:$teamId,title:$title,description:$description){ id title description status teamId assignedTo } }`,{ teamId: tTeam.value, title: tTitle.value, description: tDesc.value });
  const row = document.createElement('div'); row.className='form-row'; row.appendChild(tTeam); row.appendChild(tTitle); row.appendChild(tDesc); row.appendChild(tBtn); create.appendChild(row); forms.appendChild(create);

  const byTeam = buildCard('Tasks By Team');
  const btTeam = document.createElement('input'); btTeam.placeholder='Team ID';
  const btBtn = document.createElement('button'); btBtn.textContent='Load'; btBtn.onclick = () => sendGraphQL(`query TasksByTeam($teamId:String!){ tasksByTeam(teamId:$teamId){ id title description status assignedTo } }`,{ teamId: btTeam.value });
  const r2 = document.createElement('div'); r2.className='form-row'; r2.appendChild(btTeam); r2.appendChild(btBtn); byTeam.appendChild(r2); forms.appendChild(byTeam);

  const assign = buildCard('Assign Task');
  const asTask = document.createElement('input'); asTask.placeholder='Task ID';
  const asUser = document.createElement('input'); asUser.placeholder='User ID';
  const asBtn = document.createElement('button'); asBtn.textContent='Assign'; asBtn.onclick = () => sendGraphQL(`mutation AssignTask($taskId:String!,$userId:String!){ assignTask(taskId:$taskId,userId:$userId){ id assignedTo } }`,{ taskId: asTask.value, userId: asUser.value });
  const r3 = document.createElement('div'); r3.className='form-row'; r3.appendChild(asTask); r3.appendChild(asUser); r3.appendChild(asBtn); assign.appendChild(r3); forms.appendChild(assign);

  const update = buildCard('Update Task');
  const uTask = document.createElement('input'); uTask.placeholder='Task ID';
  const uTitle = document.createElement('input'); uTitle.placeholder='Title (optional)';
  const uDesc = document.createElement('input'); uDesc.placeholder='Description (optional)';
  const uStatus = document.createElement('select'); ['','TODO','IN_PROGRESS','DONE'].forEach(s=>{ const o=document.createElement('option'); o.value=s; o.textContent=s; uStatus.appendChild(o); });
  const uAssigned = document.createElement('input'); uAssigned.placeholder='AssignedTo (optional)';
  const uBtn = document.createElement('button'); uBtn.textContent='Update'; uBtn.onclick = () => sendGraphQL(`mutation UpdateTask($taskId:String!,$title:String,$description:String,$status:TaskStatus,$assignedTo:String){ updateTask(taskId:$taskId,title:$title,description:$description,status:$status,assignedTo:$assignedTo){ id title description status assignedTo } }`,{ taskId:uTask.value, title:uTitle.value||null, description:uDesc.value||null, status:uStatus.value||null, assignedTo:uAssigned.value||null });
  const r4 = document.createElement('div'); r4.className='form-row'; r4.appendChild(uTask); r4.appendChild(uTitle); r4.appendChild(uDesc); r4.appendChild(uStatus); r4.appendChild(uAssigned); r4.appendChild(uBtn); update.appendChild(r4); forms.appendChild(update);

  const removeAssign = buildCard('Remove Assignment');
  const raTask = document.createElement('input'); raTask.placeholder='Task ID';
  const raBtn = document.createElement('button'); raBtn.textContent='Unassign'; raBtn.onclick = () => sendGraphQL(`mutation RemoveAssignment($taskId:String!){ removeTaskAssignment(taskId:$taskId){ id assignedTo } }`,{ taskId: raTask.value });
  const r5 = document.createElement('div'); r5.className='form-row'; r5.appendChild(raTask); r5.appendChild(raBtn); removeAssign.appendChild(r5); forms.appendChild(removeAssign);

  const del = buildCard('Delete Task');
  const dTask = document.createElement('input'); dTask.placeholder='Task ID';
  const dBtn = document.createElement('button'); dBtn.textContent='Delete'; dBtn.onclick = () => sendGraphQL(`mutation DeleteTask($taskId:String!){ deleteTask(taskId:$taskId) }`,{ taskId: dTask.value });
  const r6 = document.createElement('div'); r6.className='form-row'; r6.appendChild(dTask); r6.appendChild(dBtn); del.appendChild(r6); forms.appendChild(del);
}

function buildMe(){
  const me = buildCard('Me');
  const btn = document.createElement('button'); btn.textContent='Load'; btn.onclick = () => sendGraphQL(`query{ me{ id email name } }`,{});
  me.appendChild(btn);
  forms.appendChild(me);

  const del = buildCard('Delete My Account');
  const input = document.createElement('input'); input.placeholder='Your userId';
  const btn2 = document.createElement('button'); btn2.textContent='Delete'; btn2.onclick = () => sendGraphQL(`mutation DeleteUser($userId:String!){ deleteUser(userId:$userId) }`,{ userId: input.value });
  const r = document.createElement('div'); r.className='form-row'; r.appendChild(input); r.appendChild(btn2); del.appendChild(r); forms.appendChild(del);
}

// Initialize default panel
showPanel('me');
