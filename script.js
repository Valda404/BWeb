// Task Manager Application
class TaskManager {
    constructor() {
        this.tasks = [];
        this.currentCategory = 'today';
        this.editingTaskId = null;
        this.init();
    }

    init() {
        this.cacheDOMElements();
        this.attachEventListeners();
        this.setDefaultDate();
        this.loadTasksFromFirebase();
    }

    cacheDOMElements() {
        // Category buttons
        this.categoryButtons = document.querySelectorAll('.category-btn');
        
        // Modal elements
        this.modal = document.getElementById('task-modal');
        this.modalTitle = document.getElementById('modal-title');
        this.addTaskBtn = document.getElementById('add-task-btn');
        this.closeModalBtn = document.querySelector('.close-modal');
        this.cancelBtn = document.querySelector('.btn-cancel');
        
        // Form elements
        this.taskForm = document.getElementById('task-form');
        this.taskTitleInput = document.getElementById('task-title');
        this.taskDescInput = document.getElementById('task-description');
        this.taskDateInput = document.getElementById('task-date');
        this.taskTimeInput = document.getElementById('task-time');
        this.taskPriorityInput = document.getElementById('task-priority');
        this.syncGoogleCheckbox = document.getElementById('sync-google');
        
        // Content elements
        this.tasksContainer = document.getElementById('tasks-container');
        this.categoryTitle = document.getElementById('category-title');
        
        // Stats elements
        this.totalTasksEl = document.getElementById('total-tasks');
        this.pendingTasksEl = document.getElementById('pending-tasks');
        this.completedTasksEl = document.getElementById('completed-tasks');
        
        // Sync button
        this.syncCalendarBtn = document.getElementById('sync-calendar');
    }

    attachEventListeners() {
        // Category switching
        this.categoryButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.switchCategory(e));
        });

        // Modal controls
        this.addTaskBtn.addEventListener('click', () => this.openModal());
        this.closeModalBtn.addEventListener('click', () => this.closeModal());
        this.cancelBtn.addEventListener('click', () => this.closeModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });

        // Form submission
        this.taskForm.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Google Calendar sync
        this.syncCalendarBtn.addEventListener('click', () => this.syncWithGoogleCalendar());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        this.taskDateInput.value = today;
    }

    switchCategory(e) {
        const button = e.currentTarget;
        const category = button.dataset.category;
        
        // Update active button
        this.categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Update current category
        this.currentCategory = category;
        
        // Update category title
        this.updateCategoryTitle(category);
        
        // Render filtered tasks
        this.renderTasks();
    }

    updateCategoryTitle(category) {
        const titles = {
            today: "Today's Tasks",
            week: "This Week's Tasks",
            month: "This Month's Tasks",
            all: "All Tasks",
            completed: "Completed Tasks",
            priority: "Priority Tasks"
        };
        this.categoryTitle.textContent = titles[category] || "Tasks";
    }

    openModal(taskId = null) {
        this.editingTaskId = taskId;
        
        if (taskId) {
            const task = this.tasks.find(t => t.id === taskId);
            if (task) {
                this.modalTitle.textContent = 'Edit Task';
                this.populateForm(task);
            }
        } else {
            this.modalTitle.textContent = 'Add New Task';
            this.taskForm.reset();
            this.setDefaultDate();
        }
        
        this.modal.classList.add('active');
    }

    closeModal() {
        this.modal.classList.remove('active');
        this.taskForm.reset();
        this.editingTaskId = null;
        this.setDefaultDate();
    }

    populateForm(task) {
        this.taskTitleInput.value = task.title;
        this.taskDescInput.value = task.description || '';
        this.taskDateInput.value = task.date;
        this.taskTimeInput.value = task.time || '';
        this.taskPriorityInput.value = task.priority;
        this.syncGoogleCheckbox.checked = task.syncGoogle || false;
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const task = {
            id: this.editingTaskId || this.generateId(),
            title: this.taskTitleInput.value.trim(),
            description: this.taskDescInput.value.trim(),
            date: this.taskDateInput.value,
            time: this.taskTimeInput.value,
            priority: this.taskPriorityInput.value,
            syncGoogle: this.syncGoogleCheckbox.checked,
            completed: false,
            createdAt: this.editingTaskId ? 
                this.tasks.find(t => t.id === this.editingTaskId).createdAt : 
                new Date().toISOString()
        };
        
        if (this.editingTaskId) {
            // Update existing task
            const index = this.tasks.findIndex(t => t.id === this.editingTaskId);
            this.tasks[index] = task;
        } else {
            // Add new task
            this.tasks.push(task);
        }
        
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        this.closeModal();
    }

    deleteTask(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(t => t.id !== id);
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
        }
    }

    toggleComplete(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date().toISOString() : null;
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
        }
    }

    filterTasks() {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekFromNow = new Date(today);
        weekFromNow.setDate(weekFromNow.getDate() + 7);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        switch (this.currentCategory) {
            case 'today':
                return this.tasks.filter(task => {
                    const taskDate = new Date(task.date);
                    return taskDate.toDateString() === today.toDateString();
                });
            
            case 'week':
                return this.tasks.filter(task => {
                    const taskDate = new Date(task.date);
                    return taskDate >= today && taskDate <= weekFromNow;
                });
            
            case 'month':
                return this.tasks.filter(task => {
                    const taskDate = new Date(task.date);
                    return taskDate.getMonth() === now.getMonth() && 
                           taskDate.getFullYear() === now.getFullYear();
                });
            
            case 'completed':
                return this.tasks.filter(task => task.completed);
            
            case 'priority':
                return this.tasks.filter(task => 
                    task.priority === 'high' || task.priority === 'urgent'
                );
            
            case 'all':
            default:
                return this.tasks;
        }
    }

    renderTasks() {
        const filteredTasks = this.filterTasks();
        
        if (filteredTasks.length === 0) {
            this.tasksContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <p>No tasks found</p>
                </div>
            `;
            return;
        }
        
        // Sort tasks: incomplete first, then by date, then by priority
        const sortedTasks = filteredTasks.sort((a, b) => {
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }
            
            const dateComparison = new Date(a.date) - new Date(b.date);
            if (dateComparison !== 0) return dateComparison;
            
            const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
        
        this.tasksContainer.innerHTML = sortedTasks.map(task => 
            this.createTaskHTML(task)
        ).join('');
        
        // Attach event listeners to task buttons
        this.attachTaskEventListeners();
    }

    createTaskHTML(task) {
        const taskDate = new Date(task.date);
        const formattedDate = taskDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
        
        const timeDisplay = task.time ? 
            `<span><i class="fas fa-clock"></i> ${task.time}</span>` : '';
        
        return `
            <div class="task-item priority-${task.priority} ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
                <div class="task-header">
                    <div class="task-title-section">
                        <div class="task-title">${this.escapeHtml(task.title)}</div>
                        ${task.description ? `<div class="task-description">${this.escapeHtml(task.description)}</div>` : ''}
                    </div>
                    <div class="task-actions">
                        <button class="btn-complete" title="${task.completed ? 'Mark as incomplete' : 'Mark as complete'}" data-action="toggle" data-id="${task.id}">
                            <i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"></i>
                        </button>
                        <button class="btn-edit" title="Edit task" data-action="edit" data-id="${task.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-delete" title="Delete task" data-action="delete" data-id="${task.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="task-footer">
                    <div class="task-meta">
                        <span><i class="fas fa-calendar"></i> ${formattedDate}</span>
                        ${timeDisplay}
                        ${task.syncGoogle ? '<span><i class="fab fa-google"></i> Synced</span>' : ''}
                    </div>
                    <span class="task-priority ${task.priority}">${task.priority}</span>
                </div>
            </div>
        `;
    }

    attachTaskEventListeners() {
        const actionButtons = this.tasksContainer.querySelectorAll('[data-action]');
        actionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.dataset.action;
                const id = btn.dataset.id;
                
                switch (action) {
                    case 'toggle':
                        this.toggleComplete(id);
                        break;
                    case 'edit':
                        this.openModal(id);
                        break;
                    case 'delete':
                        this.deleteTask(id);
                        break;
                }
            });
        });
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;
        
        this.totalTasksEl.textContent = total;
        this.completedTasksEl.textContent = completed;
        this.pendingTasksEl.textContent = pending;
    }

    syncWithGoogleCalendar() {
        // Placeholder for Google Calendar API integration
        const tasksToSync = this.tasks.filter(t => t.syncGoogle && !t.completed);
        
        if (tasksToSync.length === 0) {
            alert('No tasks marked for Google Calendar sync.');
            return;
        }
        
        // In a real implementation, this would use the Google Calendar API
        alert(`This feature will sync ${tasksToSync.length} task(s) with Google Calendar.\n\n` +
              'To implement:\n' +
              '1. Set up Google Calendar API credentials\n' +
              '2. Authenticate with Google OAuth 2.0\n' +
              '3. Create calendar events for each task\n\n' +
              'For now, this is a placeholder.');
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveTasks() {
        console.log('💾 Ukládám úkoly do Firebase...', this.tasks);
        window.firebaseHelpers.saveTasks(this.tasks)
            .then(() => console.log('✅ Úkoly uloženy do Firebase'))
            .catch(err => console.error('❌ Chyba při ukládání:', err));
    }

    loadTasksFromFirebase() {
        console.log('📥 Načítám úkoly z Firebase...');
        window.firebaseHelpers.listenToTasks((tasks) => {
            console.log('✅ Úkoly načteny z Firebase:', tasks);
            this.tasks = Array.isArray(tasks) ? tasks : [];
            this.renderTasks();
            this.updateStats();
        });
    }

    loadTasks() {
        // Deprecated - používáme Firebase
        const saved = localStorage.getItem('bweb-tasks');
        return saved ? JSON.parse(saved) : [];
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for Firebase to initialize
    setTimeout(() => {
        if (window.firebaseHelpers) {
            window.firebaseHelpers.onAuthChange((user) => {
                if (user) {
                    console.log('✅ Uživatel přihlášen:', user.email);
                    hideLoginModal();
                    new TaskManager();
                    initLogout();
                } else {
                    console.log('❌ Uživatel není přihlášen');
                    showLoginModal();
                    initAuthForms();
                }
            });
        } else {
            console.error('❌ Firebase se nepodařilo inicializovat');
        }
    }, 500);
});

// Logout function
function initLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            if (confirm('Opravdu se chcete odhlásit?')) {
                try {
                    await window.firebaseHelpers.signOut();
                    location.reload();
                } catch (error) {
                    console.error('Chyba při odhlášení:', error);
                    alert('Chyba při odhlášení');
                }
            }
        });
    }
}

// Auth Functions
function showLoginModal() {
    const loginModal = document.getElementById('login-modal');
    loginModal.classList.add('active');
}

function hideLoginModal() {
    const loginModal = document.getElementById('login-modal');
    loginModal.classList.remove('active');
}

function initAuthForms() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    
    // Toggle between login and register
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });
    
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    });
    
    // Handle login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        try {
            await window.firebaseHelpers.signIn(email, password);
            alert('Přihlášení proběhlo úspěšně!');
            // Firebase onAuthChange se postará o přesměrování
        } catch (error) {
            console.error('Chyba přihlášení:', error);
            alert('Chyba při přihlášení: ' + error.message);
        }
    });
    
    // Handle registration
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const passwordConfirm = document.getElementById('register-password-confirm').value;
        
        if (password !== passwordConfirm) {
            alert('Hesla se neshodují!');
            return;
        }
        
        if (password.length < 6) {
            alert('Heslo musí mít alespoň 6 znaků');
            return;
        }
        
        try {
            await window.firebaseHelpers.signUp(email, password);
            alert('Registrace proběhla úspěšně!');
            // Firebase onAuthChange se postará o přesměrování
        } catch (error) {
            console.error('Chyba registrace:', error);
            alert('Chyba při registraci: ' + error.message);
        }
    });
}

