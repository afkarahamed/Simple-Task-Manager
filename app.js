class Task {
  constructor(title) {
    this.id = Date.now().toString(); // unique ID
    this.title = title;
    this.completed = false;
  }
}

class TaskManager {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    this.form = document.getElementById('task-form');
    this.input = document.getElementById('task-input');
    this.list = document.getElementById('task-list');
    this.filters = document.getElementById('filters');

    this.form.addEventListener('submit', (e) => this.addTask(e));
    this.filters.addEventListener('click', (e) => this.handleFilter(e));

    this.activeFilter = 'all';
    this.renderTasks();

    this.editPopup = document.getElementById('edit-popup');
    this.editInput = document.getElementById('edit-input');
    this.saveEditBtn = document.getElementById('save-edit');
    this.cancelEditBtn = document.getElementById('cancel-edit');

    this.editingTaskId = null;

    this.saveEditBtn.addEventListener('click', () => this.saveEdit());
    this.cancelEditBtn.addEventListener('click', () => this.closeEditPopup());
  }

  addTask(e) {
    e.preventDefault();
    const title = this.input.value.trim();
    if (!title) return;

    const newTask = new Task(title);
    this.tasks.push(newTask);
    this.saveTasks();
    this.renderTasks();
    this.input.value = '';
  }

  toggleComplete(id) {
    const task = this.tasks.find(t => t.id === id);
    if (task) task.completed = !task.completed;
    this.saveTasks();
    this.renderTasks();
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.saveTasks();
    this.renderTasks();
  }

  handleFilter(e) {
    if (!e.target.dataset.filter) return;
    this.activeFilter = e.target.dataset.filter;

    Array.from(this.filters.children).forEach(btn =>
      btn.classList.remove('active')
    );
    e.target.classList.add('active');

    this.renderTasks();
  }

  editTask(id, newTitle) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
        task.title = newTitle.trim();
        this.saveTasks();
        this.renderTasks();
    }
    }

    handleEditKey(e, id, element) {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            element.blur();    
        }
    }


    showEditPopup(task) {
        this.editingTaskId = task.id;
        this.editInput.value = task.title;
        this.editPopup.classList.remove('hidden');
        this.editInput.focus();
        setTimeout(() => this.editInput.focus(), 100);
    }

    saveEdit() {
        const task = this.tasks.find(t => t.id === this.editingTaskId);
        if (task) {
            task.title = this.editInput.value.trim();
            this.saveTasks();
            this.renderTasks();
        }
        this.closeEditPopup();
    }

    closeEditPopup() {
        this.editingTaskId = null;
        this.editInput.value = '';
        this.editPopup.classList.add('hidden');
    }

  getFilteredTasks() {
    if (this.activeFilter === 'active') return this.tasks.filter(t => !t.completed);
    if (this.activeFilter === 'completed') return this.tasks.filter(t => t.completed);
    return this.tasks;
  }

  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  renderTasks() {
  this.list.innerHTML = '';
  const tasksToShow = this.getFilteredTasks();

  tasksToShow.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task' + (task.completed ? ' completed' : '');

    const span = document.createElement('span');
    span.textContent = task.title;

    const titleWrapper = document.createElement('div');
    titleWrapper.className = 'task-title';
    titleWrapper.appendChild(span);

    const controls = document.createElement('div');
    controls.className = 'task-controls';

    const completeBtn = document.createElement('button');
    completeBtn.textContent = '✔️';
    completeBtn.addEventListener('click', () => this.toggleComplete(task.id));

    const editBtn = document.createElement('button');
    editBtn.textContent = '✏️';
    editBtn.addEventListener('click', () => this.showEditPopup(task));

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑️';
    deleteBtn.addEventListener('click', () => this.deleteTask(task.id));

    controls.appendChild(completeBtn);
    controls.appendChild(editBtn);
    controls.appendChild(deleteBtn);

    li.appendChild(titleWrapper);
    li.appendChild(controls);
    this.list.appendChild(li);
  });
}
}

const app = new TaskManager();