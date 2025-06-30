class Task {
  constructor(title, dueDate = null, priority = 'low') {
    this.id = Date.now().toString();
    this.title = title;
    this.completed = false;
    this.dueDate = dueDate;
    this.priority = priority;
  }
}

class TaskManager {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    this.form = document.getElementById('task-form');
    this.input = document.getElementById('task-input');
    this.list = document.getElementById('task-list');
    this.filters = document.getElementById('filters');

    this.editPopup = document.getElementById('edit-popup');
    this.editInput = document.getElementById('edit-input');
    this.editDueDateInput = document.getElementById('edit-due-date');
    this.saveEditBtn = document.getElementById('save-edit');
    this.cancelEditBtn = document.getElementById('cancel-edit');

    this.themeToggleBtn = document.getElementById('toggle-theme'); 
    this.editingTaskId = null;
    this.activeFilter = 'all';

    this.form.addEventListener('submit', (e) => this.addTask(e));
    this.filters.addEventListener('click', (e) => this.handleFilter(e));
    this.saveEditBtn.addEventListener('click', () => this.saveEdit());
    this.cancelEditBtn.addEventListener('click', () => this.closeEditPopup());
    this.themeToggleBtn.addEventListener('click', () => this.toggleTheme()); 

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
      this.themeToggleBtn.textContent = 'Switch to Light Mode';
    } else {
      this.themeToggleBtn.textContent = 'Switch to Dark Mode';
    }

    // Initial render
    this.renderTasks();
  }

  addTask(e) {
    e.preventDefault();
    const title = this.input.value.trim();
    const dueDate = document.getElementById('due-date').value;

    if (!title) return;

    const priority = document.getElementById('priority-select').value;
    const newTask = new Task(title, dueDate, priority);
    this.tasks.push(newTask);
    this.saveTasks();
    this.renderTasks();
    this.input.value = '';
    document.getElementById('due-date').value = '';
    
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
        this.editDueDateInput.value = task.dueDate || '';
        this.editPopup.classList.remove('hidden');
        setTimeout(() => this.editInput.focus(), 100);
    }   

    saveEdit() {
        const task = this.tasks.find(t => t.id === this.editingTaskId);
        if (task) {
            task.title = this.editInput.value.trim();
            task.dueDate = this.editDueDateInput.value; 
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

    toggleTheme() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        this.themeToggleBtn.textContent = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');   
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

    const due = document.createElement('small');
    due.textContent = `Due: ${task.dueDate}`;
    due.style.marginLeft = '10px'; 

    const today = new Date().toISOString().split('T')[0];
    if (!task.completed && task.dueDate < today) {
        due.style.color = 'red';
        due.style.fontWeight = 'bold';
        due.textContent += ' (Overdue!)';
    } else if(!task.completed && task.dueDate === today){
        due.style.color = 'orange';
        due.style.fontWeight = 'bold';
        due.textContent += ' (Due Today)';
    }

    titleWrapper.appendChild(due);


    const priorityBadge = document.createElement('span');
    priorityBadge.textContent = task.priority;
    priorityBadge.className = `priority-badge ${task.priority}`;
    titleWrapper.appendChild(priorityBadge);
  });
}
}

const app = new TaskManager();