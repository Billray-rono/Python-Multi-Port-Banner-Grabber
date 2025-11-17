// scripts.js — interactive behaviour for the Acme Careers static site

let jobs = [];
// color mapping used for department badges
const departmentColors = {
  Engineering: '#06b6d4',
  Design: '#7c3aed',
  Data: '#f59e0b',
  Operations: '#10b981',
  Marketing: '#ef4444',
  'Customer Success': '#f97316',
  'Acme Labs': '#60a5fa'
};
const jobsList = document.getElementById('jobsList');
const searchInput = document.getElementById('searchInput');
const filterDepartment = document.getElementById('filterDepartment');
const filterLocation = document.getElementById('filterLocation');
const filterType = document.getElementById('filterType');
const remoteOnly = document.getElementById('remoteOnly');
const noResults = document.getElementById('noResults');

// Modal elements
const applyModal = document.getElementById('applyModal');
const modalClose = document.getElementById('modalClose');
const modalCancel = document.getElementById('modalCancel');
const modalJobSubtitle = document.getElementById('modalJobSubtitle');
const applyForm = document.getElementById('applyForm');
const applyJobId = document.getElementById('applyJobId');
const applySuccess = document.getElementById('applySuccess');

function fetchJobs(){
  return fetch('jobs.json')
    .then(r => r.ok ? r.json() : Promise.reject(r.status))
    .catch(() => {
      // Fallback to empty array on failure
      console.warn('Failed to load jobs.json');
      return [];
    });
}

function populateFilters(list){
  const departments = new Set();
  const locations = new Set();
  list.forEach(j => { departments.add(j.department); locations.add(j.location); });

  // reset
  filterDepartment.innerHTML = '<option value="">All departments</option>';
  filterLocation.innerHTML = '<option value="">All locations</option>';

  Array.from(departments).sort().forEach(d => {
    const o = document.createElement('option'); o.value = d; o.textContent = d; filterDepartment.appendChild(o);
  });
  Array.from(locations).sort().forEach(l => {
    const o = document.createElement('option'); o.value = l; o.textContent = l; filterLocation.appendChild(o);
  });
}

function renderJobs(list){
  jobsList.innerHTML = '';
  if(!list.length){ noResults.hidden = false; return; }
  noResults.hidden = true;

  list.forEach(job => {
    const card = document.createElement('article');
    card.className = 'job-card';
    const deptColor = departmentColors[job.department] || '#6b7280';
    card.innerHTML = `
      <div class="job-top" style="display:flex;align-items:center;justify-content:space-between;gap:8px">
        <div style="display:flex;align-items:center;gap:8px">
          <h4 style="margin:0">${escapeHtml(job.title)}</h4>
          <span class="dept-pill" style="background:${deptColor}">${escapeHtml(job.department)}</span>
        </div>
      </div>
      <div class="job-meta">${escapeHtml(job.company)} • ${escapeHtml(job.location)} • ${escapeHtml(job.type)} ${job.remote? '• Remote': ''}</div>
      <div class="job-desc">${escapeHtml(job.description)}</div>
      <div class="job-actions">
        <button class="btn" data-action="apply" data-id="${job.id}">Apply</button>
        <button class="btn btn-outline" data-action="details" data-id="${job.id}">Details</button>
      </div>
    `;
    jobsList.appendChild(card);
  });
}

function escapeHtml(s){
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;');
}

function filterAndSearch(){
  const q = (searchInput.value || '').toLowerCase().trim();
  const dept = filterDepartment.value;
  const loc = filterLocation.value;
  const type = filterType.value;
  const rem = remoteOnly.checked;

  const filtered = jobs.filter(j => {
    if(dept && j.department !== dept) return false;
    if(loc && j.location !== loc) return false;
    if(type && j.type !== type) return false;
    if(rem && !j.remote) return false;
    if(!q) return true;
    const hay = (j.title + ' ' + j.description + ' ' + j.company).toLowerCase();
    return hay.includes(q);
  });
  renderJobs(filtered);
}

// debounce helper
function debounce(fn, wait=250){
  let t;
  return (...a)=>{ clearTimeout(t); t = setTimeout(()=>fn(...a), wait); };
}

// click delegation for job actions
jobsList.addEventListener('click', (e)=>{
  const btn = e.target.closest('button');
  if(!btn) return;
  const action = btn.dataset.action;
  const id = btn.dataset.id;
  if(action === 'apply') openApplyModal(id);
  if(action === 'details') openDetails(id);
});

function openDetails(id){
  const job = jobs.find(j=>String(j.id)===String(id));
  if(!job) return;
  alert(`${job.title}\n\n${job.description}\n\nLocation: ${job.location} - ${job.type}${job.remote? '\nRemote: yes':''}`);
}

function openApplyModal(id){
  const job = jobs.find(j=>String(j.id)===String(id));
  if(!job) return;
  applyJobId.value = job.id;
  modalJobSubtitle.textContent = `${job.title} — ${job.company}`;
  applyForm.reset();
  applySuccess.hidden = true;
  applyModal.setAttribute('aria-hidden','false');
}

function closeApplyModal(){
  applyModal.setAttribute('aria-hidden','true');
}

modalClose.addEventListener('click', closeApplyModal);
modalCancel.addEventListener('click', closeApplyModal);
applyModal.addEventListener('click',(e)=>{ if(e.target===applyModal) closeApplyModal(); });

applyForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const id = applyJobId.value;
  const name = document.getElementById('appName').value.trim();
  const email = document.getElementById('appEmail').value.trim();
  const note = document.getElementById('appNote').value.trim();
  const resumeInput = document.getElementById('appResume');
  const resumeName = resumeInput && resumeInput.files && resumeInput.files[0] ? resumeInput.files[0].name : null;

  const application = {
    id: 'app_' + Date.now(),
    jobId: id,
    name, email, note, resumeName, submittedAt: new Date().toISOString()
  };

  // Store in localStorage to simulate a backend
  const key = 'acme_applications_v1';
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  existing.push(application);
  localStorage.setItem(key, JSON.stringify(existing));

  applySuccess.hidden = false;
  // hide form to prevent duplicates
  applyForm.hidden = true;
});

// restore form when modal opens
applyModal.addEventListener('transitionend', ()=>{
  applyForm.hidden = false;
});

// initialize
Promise.resolve()
  .then(fetchJobs)
  .then(list => { jobs = list; populateFilters(jobs); renderJobs(jobs); })
  .catch(err => { console.error(err); });

// wire up inputs
searchInput.addEventListener('input', debounce(filterAndSearch, 200));
filterDepartment.addEventListener('change', filterAndSearch);
filterLocation.addEventListener('change', filterAndSearch);
filterType.addEventListener('change', filterAndSearch);
remoteOnly.addEventListener('change', filterAndSearch);

// small accessibility: close modal with Escape
window.addEventListener('keydown', e=>{ if(e.key==='Escape') closeApplyModal(); });

// helpful: expose jobs for debugging
window.__ACME = { getJobs: ()=>jobs };
