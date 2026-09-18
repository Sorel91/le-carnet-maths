(() => {
  const style = document.createElement('style');
  style.textContent = '.topics-field{display:grid;gap:9px}.topics-head{display:flex;justify-content:space-between;align-items:center}.topics-head label{font-size:.84rem;font-weight:700;color:var(--muted)}#topic-rows{display:grid;gap:8px}.topic-row{display:grid;grid-template-columns:minmax(0,1fr) 145px 34px;gap:8px;align-items:center}.remove-topic{border:0;background:#f9e3de;color:#8a3325;border-radius:8px;height:40px;font-size:1.2rem;cursor:pointer}.record-item p{white-space:pre-line}@media(max-width:560px){.topic-row{grid-template-columns:1fr 1fr 34px}.topics-head{align-items:flex-start;flex-direction:column}}';
  document.head.appendChild(style);
  const form = $('#note-form');
  form.querySelector('[name="status"]').closest('label').remove();
  form.querySelector('[name="note"]').closest('label').remove();
  const nextLabel = form.querySelector('[name="next"]').closest('label');
  nextLabel.insertAdjacentHTML('beforebegin', `<div class="topics-field"><div class="topics-head"><label>Thématiques de la séance</label><button type="button" class="secondary-button" id="add-topic">+ Thématique</button></div><div id="topic-rows"></div></div>`);
  const rows = $('#topic-rows');
  const addTopic = (topic = '', status = 'Bien') => {
    const row = document.createElement('div');
    row.className = 'topic-row';
    row.innerHTML = `<input required class="topic-name" value="${esc(topic)}" placeholder="Ex. Addition de fractions"><select class="topic-status"><option ${status==='Très bien'?'selected':''}>Très bien</option><option ${status==='Bien'?'selected':''}>Bien</option><option ${status==='À consolider'?'selected':''}>À consolider</option><option ${status==='Difficile'?'selected':''}>Difficile</option></select><button type="button" class="remove-topic" aria-label="Retirer cette thématique">×</button>`;
    row.querySelector('.remove-topic').onclick = () => { if (rows.children.length > 1) row.remove(); };
    rows.appendChild(row);
  };
  $('#add-topic').onclick = () => addTopic();
  record = function(id) {
    noteId = id;
    $('#note-student-name').textContent = d.students.find(x => x.id === id).name;
    form.reset(); rows.innerHTML = ''; addTopic();
    $('#note-session').innerHTML = [d.session, ...d.history].map((x, i) => `<option value="${x.id || 'current'}">${esc(x.title)} — ${fr(x.date)}${i ? '' : ' (en cours)'}</option>`).join('');
    $('#note-dialog').showModal();
  };
  form.onsubmit = event => {
    event.preventDefault();
    const student = d.students.find(x => x.id === noteId);
    const values = Object.fromEntries(new FormData(form));
    const session = values.sessionId === 'current' ? d.session : d.history.find(x => String(x.id) === values.sessionId);
    const topics = [...rows.querySelectorAll('.topic-row')].map(row => ({ topic: row.querySelector('.topic-name').value.trim(), status: row.querySelector('.topic-status').value })).filter(x => x.topic);
    student.records.push({ title: session.title, date: session.date, status: `${topics.length} thématique${topics.length > 1 ? 's' : ''}`, note: topics.map(x => `${x.topic} — ${x.status}`).join('\n'), next: values.next, topics });
    student.next = values.next; save(); $('#note-dialog').close(); students(); today(); toast('Suivi par thématiques ajouté.');
  };
})();
