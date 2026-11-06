// 1. Données initiales et persistance locale
const STORAGE_KEY = 'kanbanflow_tasks_v1';

const defaultTasks = [
  {
    id: 'task-1',
    title: 'Optimiser le bundle JavaScript',
    desc: 'Réduire le temps de chargement initial en isolant les chunks inutilisés.',
    priority: 'high',
    column: 'todo',
    createdAt: new Date().toLocaleDateString('fr-FR')
  },
  {
    id: 'task-2',
    title: 'Intégrer les filtres d’URL dynamiques',
    desc: 'Synchroniser l’état des filtres avec URLSearchParams.',
    priority: 'medium',
    column: 'in_progress',
    createdAt: new Date().toLocaleDateString('fr-FR')
  },
  {
    id: 'task-3',
    title: 'Déployer la v1 sur Vercel',
    desc: 'Lier le dépôt GitHub et tester le pipeline de déploiement continu.',
    priority: 'low',
    column: 'done',
    createdAt: new Date().toLocaleDateString('fr-FR')
  }
];

function loadTasks() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return defaultTasks;
  try {
    return JSON.parse(saved);
  } catch {
    return defaultTasks;
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

let tasks = loadTasks();
let searchQuery = '';

// 2. Rendu du tableau (DOM)
function renderBoard() {
  const columns = ['todo', 'in_progress', 'done'];

  columns.forEach((col) => {
    const zone = document.getElementById(`zone-${col}`);
    const countElem = document.getElementById(`count-${col}`);

    // Filtrer par colonne et par recherche
    const colTasks = tasks.filter((t) => {
      const matchCol = t.column === col;
      const matchSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCol && matchSearch;
    });

    countElem.textContent = colTasks.length;
    zone.innerHTML = '';

    colTasks.forEach((task) => {
      const card = document.createElement('article');
      card.className = 'task-card';
      card.setAttribute('draggable', 'true');
      card.setAttribute('data-id', task.id);

      card.innerHTML = `
        <div class="task-card-header">
          <span class="task-title">${escapeHTML(task.title)}</span>
          <button class="btn-delete" title="Supprimer la tâche">&times;</button>
        </div>
        ${task.desc ? `<p class="task-desc">${escapeHTML(task.desc)}</p>` : ''}
        <div class="task-footer">
          <span class="priority-tag priority-${task.priority}">${task.priority}</span>
          <span class="task-date">${task.createdAt}</span>
        </div>
      `;

      // Suppression de tâche
      card.querySelector('.btn-delete').addEventListener('click', (e) => {
        e.stopPropagation();
        tasks = tasks.filter((t) => t.id !== task.id);
        saveTasks();
        renderBoard();
      });

      // Événements Drag & Drop sur la carte
      card.addEventListener('dragstart', (e) => {
        card.classList.add('dragging');
        e.dataTransfer.setData('text/plain', task.id);
        e.dataTransfer.effectAllowed = 'move';
      });

      card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
      });

      zone.appendChild(card);
    });
  });
}

// 3. Gestion native du Drag-and-Drop sur les dropzones
const dropzones = document.querySelectorAll('.dropzone');

dropzones.forEach((zone) => {
  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    zone.classList.add('drag-over');
  });

  zone.addEventListener('dragleave', () => {
    zone.classList.remove('drag-over');
  });

  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('drag-over');

    const taskId = e.dataTransfer.getData('text/plain');
    const targetColumn = zone.parentElement.getAttribute('data-column');

    const task = tasks.find((t) => t.id === taskId);
    if (task && task.column !== targetColumn) {
      task.column = targetColumn;
      saveTasks();
      renderBoard();
    }
  });
});

// 4. Modal d'ajout de tâche
const modal = document.getElementById('modal');
const btnNewTask = document.getElementById('btn-new-task');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnCancel = document.getElementById('btn-cancel');
const taskForm = document.getElementById('task-form');

function openModal() {
  modal.classList.remove('hidden');
  document.getElementById('task-title').focus();
}

function closeModal() {
  modal.classList.add('hidden');
  taskForm.reset();
}

btnNewTask.addEventListener('click', openModal);
btnCloseModal.addEventListener('click', closeModal);
btnCancel.addEventListener('click', closeModal);

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.getElementById('task-title').value.trim();
  const desc = document.getElementById('task-desc').value.trim();
  const priority = document.getElementById('task-priority').value;
  const column = document.getElementById('task-column').value;

  if (!title) return;

  const newTask = {
    id: `task-${crypto.randomUUID()}`,
    title,
    desc,
    priority,
    column,
    createdAt: new Date().toLocaleDateString('fr-FR')
  };

  tasks.unshift(newTask);
  saveTasks();
  renderBoard();
  closeModal();
});

// 5. Recherche en direct
document.getElementById('search-input').addEventListener('input', (e) => {
  searchQuery = e.target.value;
  renderBoard();
});

// 6. Export JSON
document.getElementById('btn-export').addEventListener('click', () => {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `kanbanflow_export_${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
});

// Utilitaire de sécurisation XSS
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g,
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// Initialisation
renderBoard();