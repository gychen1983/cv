const defaultData = {
  profile: { name: '陳光耀', bio: '我是一名视觉研究者与影像创作者，关注传统文化、空间记忆与物质细节，尝试用当代视觉语言保存那些正在发生的故事。', years: '05', projects: '08', fields: '03', updated: '2024.09.14', about: '我相信每一件器物、每一个空间，都有一段值得被重新观看的时间。我的工作从现场出发，在光线、材料和人的使用痕迹之间，寻找文化继续生长的证据。' },
  projects: [
    { title: '光的秩序 / Temple Field Notes', type: 'space', tag: 'SPACE / PHOTO ESSAY', year: '2024', description: '记录寺院建筑中的天花、光线与动线，研究仪式空间如何通过视觉秩序建立情绪。', image: '实图1.png' },
    { title: '金色信物 / Object Study', type: 'object', tag: 'OBJECT / MATERIAL', year: '2024', description: '以近距离影像观察佛具的尺度、反光与工艺纹样，让材料成为叙述本身。', image: '实图2.png' },
    { title: '千手之间 / Sacred Center', type: 'space', tag: 'SPACE / DOCUMENTARY', year: '2023', description: '从正面视角建立人与造像之间的观看关系，关注空间中心如何聚合注意力。', image: '实图3.png' },
    { title: '纹样档案 / Living Detail', type: 'detail', tag: 'DETAIL / VISUAL ARCHIVE', year: '2023', description: '采集传统装饰中的瑞兽、云纹与金属肌理，建立可以持续扩展的视觉档案。', image: '实图4.png' }
  ],
  experience: [
    { date: '2022 — NOW', company: 'Independent Visual Practice', role: 'VISUAL RESEARCHER / PHOTOGRAPHER', place: 'HONG KONG' },
    { date: '2020 — 2022', company: 'Cultural Image Lab', role: 'IMAGE EDITOR / RESEARCH ASSISTANT', place: 'GUANGZHOU' },
    { date: '2019 — 2020', company: 'Open Field Studio', role: 'DESIGN + DOCUMENTATION', place: 'SHENZHEN' }
  ],
  skills: ['Visual research', 'Photography', 'Archival thinking', 'Art direction', 'Cultural documentation', 'Light & material', 'Editorial design', 'Chinese visual culture']
};

const $ = (selector) => document.querySelector(selector);
let data = readData();
function readData() { try { return JSON.parse(localStorage.getItem('guangyao-portfolio-data')) || defaultData; } catch { return defaultData; } }
function render() {
  $('#profile-name').innerHTML = `${data.profile.name}<br><em>finds meaning</em><br>in the details.`;
  $('#profile-bio').textContent = data.profile.bio;
  $('#metric-years').textContent = data.profile.years;
  $('#metric-projects').textContent = data.profile.projects;
  $('#metric-fields').textContent = data.profile.fields;
  $('#last-updated').textContent = data.profile.updated;
  $('#about-text').textContent = data.profile.about;
  renderProjects('all');
  $('#experience-list').innerHTML = data.experience.map(item => `<article class="experience-item"><div class="experience-date">${item.date}</div><div><div class="experience-company">${item.company}</div><div class="experience-role">${item.role}</div></div><div class="experience-place">${item.place}</div></article>`).join('');
  $('#skills-list').innerHTML = data.skills.map(skill => `<span class="skill">${skill}</span>`).join('');
}
function renderProjects(filter) {
  const projects = filter === 'all' ? data.projects : data.projects.filter(project => project.type === filter);
  $('#project-list').innerHTML = projects.map(project => `<article class="project-card"><div class="project-image"><img src="${project.image}" alt="${project.title}" loading="lazy"><span class="project-label">${project.tag}</span></div><div class="project-info"><h3>${project.title}</h3><span class="project-year">${project.year}</span></div><p class="project-description">${project.description}</p></article>`).join('');
}
function saveData() {
  try {
    const next = JSON.parse($('#data-editor').value);
    if (!next.profile || !Array.isArray(next.projects) || !Array.isArray(next.experience) || !Array.isArray(next.skills)) throw new Error('Invalid data');
    data = next; localStorage.setItem('guangyao-portfolio-data', JSON.stringify(data)); render(); $('#editor-dialog').close(); $('#save-state').textContent = 'SAVED JUST NOW';
  } catch { $('#save-state').textContent = 'CHECK JSON FORMAT'; }
}
render();
document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => { document.querySelectorAll('.filter').forEach(item => item.classList.remove('active')); button.classList.add('active'); renderProjects(button.dataset.filter); }));
$('#edit-button').addEventListener('click', () => { $('#data-editor').value = JSON.stringify(data, null, 2); $('#editor-dialog').showModal(); });
$('#save-data').addEventListener('click', event => { event.preventDefault(); saveData(); });
$('#theme-toggle').addEventListener('click', () => { document.body.classList.toggle('dark'); $('#theme-toggle').textContent = document.body.classList.contains('dark') ? '☼' : '◐'; });
$('#editor-dialog').addEventListener('click', event => { if (event.target === $('#editor-dialog')) $('#editor-dialog').close(); });
