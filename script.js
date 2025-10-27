// ===== HLAVNÍ APLIKACE - TASK MANAGER =====
// Třída TaskManager řídí celou aplikaci pro správu úkolů
// Obsahuje veškerou logiku pro vytváření, úpravu, mazání a filtrování úkolů

class TaskManager {
    // ===== KONSTRUKTOR - INICIALIZACE APLIKACE =====
    constructor() {
        this.tasks = [];                    // Pole všech úkolů uživatele
        this.currentCategory = 'today';     // Aktuálně vybraná kategorie (today/week/month/all/completed/priority)
        this.editingTaskId = null;          // ID úkolu, který se právě upravuje (null = vytváříme nový)
        this.init();                        // Spuštění inicializace
    }

    // ===== INICIALIZAČNÍ METODA =====
    // Volá se při vytvoření instance TaskManageru
    init() {
        this.cacheDOMElements();            // Najde a uloží všechny HTML elementy
        this.attachEventListeners();        // Připojí event listenery (kliknutí, submit...)
        this.setDefaultDate();              // Nastaví dnešní datum do formuláře
        this.loadTasksFromFirebase();       // Načte úkoly z Firebase databáze
    }

    // ===== CACHOVÁNÍ DOM ELEMENTŮ =====
    // Najde všechny potřebné HTML elementy a uloží je do proměnných
    // Díky tomu nemusíme pořád používat document.querySelector
    cacheDOMElements() {
        // Tlačítka kategorií (Dnes, Týden, Měsíc...)
        this.categoryButtons = document.querySelectorAll('.category-btn');
        
        // Prvky modálního okna (popup pro přidání/úpravu úkolu)
        this.modal = document.getElementById('task-modal');
        this.modalTitle = document.getElementById('modal-title');
        this.addTaskBtn = document.getElementById('add-task-btn');
        this.closeModalBtn = document.querySelector('.close-modal');
        this.cancelBtn = document.querySelector('.btn-cancel');
        
        // Formulářové prvky
        this.taskForm = document.getElementById('task-form');
        this.taskTitleInput = document.getElementById('task-title');
        this.taskDescInput = document.getElementById('task-description');
        this.taskDateInput = document.getElementById('task-date');
        this.taskTimeInput = document.getElementById('task-time');
        this.taskPriorityInput = document.getElementById('task-priority');
        this.syncGoogleCheckbox = document.getElementById('sync-google');
        
        // Prvky pro zobrazení obsahu
        this.tasksContainer = document.getElementById('tasks-container');
        this.categoryTitle = document.getElementById('category-title');
        
        // Prvky pro statistiky
        this.totalTasksEl = document.getElementById('total-tasks');
        this.pendingTasksEl = document.getElementById('pending-tasks');
        this.completedTasksEl = document.getElementById('completed-tasks');
        
        // Tlačítko synchronizace s Google Kalendářem
        this.syncCalendarBtn = document.getElementById('sync-calendar');
    }

    // ===== PŘIPOJENÍ EVENT LISTENERŮ =====
    // Nastaví funkce, které se mají zavolat při různých událostech (kliknutí, submit...)
    attachEventListeners() {
        // Přepínání kategorií - při kliknutí na tlačítko kategorie
        this.categoryButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.switchCategory(e));
        });

        // Ovládání modálního okna
        this.addTaskBtn.addEventListener('click', () => this.openModal());           // Otevření modálu
        this.closeModalBtn.addEventListener('click', () => this.closeModal());       // Zavření křížkem
        this.cancelBtn.addEventListener('click', () => this.closeModal());           // Zavření tlačítkem Zrušit
        // Zavření při kliknutí mimo modální okno (na tmavé pozadí)
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });

        // Odeslání formuláře (vytvoření/úprava úkolu)
        this.taskForm.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Synchronizace s Google Kalendářem
        this.syncCalendarBtn.addEventListener('click', () => this.syncWithGoogleCalendar());

        // Klávesové zkratky
        document.addEventListener('keydown', (e) => {
            // ESC zavře modální okno
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    // ===== NASTAVENÍ VÝCHOZÍHO DATA =====
    // Nastaví dnešní datum do formuláře jako výchozí hodnotu
    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];  // Formát: YYYY-MM-DD
        this.taskDateInput.value = today;
    }

    // ===== PŘEPNUTÍ KATEGORIE =====
    // Zavolá se při kliknutí na tlačítko kategorie (Dnes, Týden, Měsíc...)
    switchCategory(e) {
        const button = e.currentTarget;              // Tlačítko, na které se kliklo
        const category = button.dataset.category;    // Kategorie z data-category atributu
        
        // Odebere třídu 'active' ze všech tlačítek
        this.categoryButtons.forEach(btn => btn.classList.remove('active'));
        // Přidá třídu 'active' k aktuálnímu tlačítku (modré zvýraznění)
        button.classList.add('active');
        
        // Uloží aktuální kategorii
        this.currentCategory = category;
        
        // Aktualizuje nadpis kategorie
        this.updateCategoryTitle(category);
        
        // Znovu vykreslí úkoly podle nové kategorie
        this.renderTasks();
    }

    // ===== AKTUALIZACE NADPISU KATEGORIE =====
    // Změní text nadpisu podle vybrané kategorie
    updateCategoryTitle(category) {
        // Mapa názvů kategorií
        const titles = {
            today: "Today's Tasks",
            week: "This Week's Tasks",
            month: "This Month's Tasks",
            all: "All Tasks",
            completed: "Completed Tasks",
            priority: "Priority Tasks"
        };
        // Nastaví text nadpisu (nebo "Tasks" pokud kategorie není definovaná)
        this.categoryTitle.textContent = titles[category] || "Tasks";
    }

    // ===== OTEVŘENÍ MODÁLNÍHO OKNA =====
    // Otevře modální okno pro přidání nového úkolu nebo úpravu existujícího
    // @param {String|null} taskId - ID úkolu k úpravě (null = nový úkol)
    openModal(taskId = null) {
        this.editingTaskId = taskId;  // Uloží ID upravovaného úkolu (nebo null)
        
        if (taskId) {
            // REŽIM ÚPRAVY - najde úkol podle ID
            const task = this.tasks.find(t => t.id === taskId);
            if (task) {
                this.modalTitle.textContent = 'Edit Task';  // Nadpis "Upravit úkol"
                this.populateForm(task);                     // Vyplní formulář daty úkolu
            }
        } else {
            // REŽIM PŘIDÁNÍ - nový úkol
            this.modalTitle.textContent = 'Add New Task';    // Nadpis "Přidat úkol"
            this.taskForm.reset();                           // Vyčistí formulář
            this.setDefaultDate();                           // Nastaví dnešní datum
        }
        
        // Zobrazí modální okno (přidá třídu 'active')
        this.modal.classList.add('active');
    }

    // ===== ZAVŘENÍ MODÁLNÍHO OKNA =====
    // Skryje modální okno a vyčistí formulář
    closeModal() {
        this.modal.classList.remove('active');  // Skryje modální okno
        this.taskForm.reset();                  // Vyčistí všechna pole formuláře
        this.editingTaskId = null;              // Resetuje ID upravovaného úkolu
        this.setDefaultDate();                  // Nastaví znovu dnešní datum
    }

    // ===== VYPLNĚNÍ FORMULÁŘE =====
    // Vyplní formulářová pole daty úkolu (při úpravě)
    // @param {Object} task - Objekt úkolu s daty
    populateForm(task) {
        this.taskTitleInput.value = task.title;                         // Název úkolu
        this.taskDescInput.value = task.description || '';              // Popis (nebo prázdný řetězec)
        this.taskDateInput.value = task.date;                           // Datum
        this.taskTimeInput.value = task.time || '';                     // Čas (nebo prázdný)
        this.taskPriorityInput.value = task.priority;                   // Priorita
        this.syncGoogleCheckbox.checked = task.syncGoogle || false;     // Checkbox Google sync
    }

    // ===== ZPRACOVÁNÍ ODESLÁNÍ FORMULÁŘE =====
    // Zavolá se při odeslání formuláře (tlačítko Uložit)
    // Vytvoří nový úkol nebo aktualizuje existující
    handleFormSubmit(e) {
        e.preventDefault();  // Zabrání defaultnímu odeslání formuláře (reload stránky)
        
        // Vytvoří objekt úkolu z dat ve formuláři
        const task = {
            id: this.editingTaskId || this.generateId(),        // Použije existující ID nebo vygeneruje nové
            title: this.taskTitleInput.value.trim(),            // Název (trim odstraní mezery na začátku/konci)
            description: this.taskDescInput.value.trim(),       // Popis
            date: this.taskDateInput.value,                     // Datum
            time: this.taskTimeInput.value,                     // Čas
            priority: this.taskPriorityInput.value,             // Priorita (low/medium/high/urgent)
            syncGoogle: this.syncGoogleCheckbox.checked,        // Zda synchronizovat s Google
            completed: false,                                   // Nový úkol je vždy nesplněný
            createdAt: this.editingTaskId ?                     // Datum vytvoření
                this.tasks.find(t => t.id === this.editingTaskId).createdAt :  // Ponechá původní
                new Date().toISOString()                        // Nebo vytvoří nové
        };
        
        // Rozhodne, zda upravovat existující úkol nebo přidat nový
        if (this.editingTaskId) {
            // AKTUALIZACE - najde úkol podle ID a nahradí ho
            const index = this.tasks.findIndex(t => t.id === this.editingTaskId);
            this.tasks[index] = task;
        } else {
            // PŘIDÁNÍ - přidá nový úkol na konec pole
            this.tasks.push(task);
        }
        
        // Uloží úkoly do Firebase
        this.saveTasks();
        // Znovu vykreslí seznam úkolů
        this.renderTasks();
        // Aktualizuje statistiky (počty úkolů)
        this.updateStats();
        // Zavře modální okno
        this.closeModal();
    }

    // ===== SMAZÁNÍ ÚKOLU =====
    // Smaže úkol po potvrzení uživatelem
    // @param {String} id - ID úkolu ke smazání
    deleteTask(id) {
        // Zobrazí potvrzovací dialog
        if (confirm('Are you sure you want to delete this task?')) {
            // Odfiltruje úkol s daným ID (vytvoří nové pole bez tohoto úkolu)
            this.tasks = this.tasks.filter(t => t.id !== id);
            // Uloží změny do Firebase
            this.saveTasks();
            // Znovu vykreslí seznam
            this.renderTasks();
            // Aktualizuje statistiky
            this.updateStats();
        }
    }

    // ===== PŘEPNUTÍ DOKONČENÍ ÚKOLU =====
    // Označí úkol jako dokončený nebo nedokončený (toggle)
    // @param {String} id - ID úkolu
    toggleComplete(id) {
        // Najde úkol podle ID
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            // Přepne hodnotu completed (true -> false nebo false -> true)
            task.completed = !task.completed;
            // Uloží čas dokončení (nebo null pokud se označí jako nedokončený)
            task.completedAt = task.completed ? new Date().toISOString() : null;
            // Uloží změny
            this.saveTasks();
            // Znovu vykreslí seznam
            this.renderTasks();
            // Aktualizuje statistiky
            this.updateStats();
        }
    }

    // ===== FILTROVÁNÍ ÚKOLŮ PODLE KATEGORIE =====
    // Vrátí pole úkolů podle aktuálně vybrané kategorie
    // @returns {Array} - Filtrované úkoly
    filterTasks() {
        const now = new Date();  // Aktuální datum a čas
        // Dnešní datum (bez času - pouze den)
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        // Datum za týden
        const weekFromNow = new Date(today);
        weekFromNow.setDate(weekFromNow.getDate() + 7);
        // Poslední den aktuálního měsíce
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        // Podle aktuální kategorie vrátí příslušné úkoly
        switch (this.currentCategory) {
            case 'today':
                // Úkoly na dnešní den
                return this.tasks.filter(task => {
                    const taskDate = new Date(task.date);
                    return taskDate.toDateString() === today.toDateString();
                });
            
            case 'week':
                // Úkoly do týdne
                return this.tasks.filter(task => {
                    const taskDate = new Date(task.date);
                    return taskDate >= today && taskDate <= weekFromNow;
                });
            
            case 'month':
                // Úkoly v aktuálním měsíci
                return this.tasks.filter(task => {
                    const taskDate = new Date(task.date);
                    return taskDate.getMonth() === now.getMonth() && 
                           taskDate.getFullYear() === now.getFullYear();
                });
            
            case 'completed':
                // Pouze dokončené úkoly
                return this.tasks.filter(task => task.completed);
            
            case 'priority':
                // Pouze úkoly s vysokou nebo urgentní prioritou
                return this.tasks.filter(task => 
                    task.priority === 'high' || task.priority === 'urgent'
                );
            
            case 'all':
            default:
                // Všechny úkoly
                return this.tasks;
        }
    }

    // ===== VYKRESLENÍ SEZNAMU ÚKOLŮ =====
    // Vykreslí úkoly na stránku podle aktuální kategorie
    renderTasks() {
        // Získá filtrované úkoly
        const filteredTasks = this.filterTasks();
        
        // Pokud nejsou žádné úkoly, zobrazí prázdný stav
        if (filteredTasks.length === 0) {
            this.tasksContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <p>No tasks found</p>
                </div>
            `;
            return;
        }
        
        // Seřadí úkoly podle pravidel:
        // 1. Nedokončené úkoly nahoře
        // 2. Potom podle data (nejdříve nejbližší)
        // 3. Potom podle priority (urgent -> high -> medium -> low)
        const sortedTasks = filteredTasks.sort((a, b) => {
            // 1. Dokončené úkoly dolů
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }
            
            // 2. Seřazení podle data
            const dateComparison = new Date(a.date) - new Date(b.date);
            if (dateComparison !== 0) return dateComparison;
            
            // 3. Seřazení podle priority
            const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
        
        // Vytvoří HTML pro všechny úkoly a vloží je do kontejneru
        this.tasksContainer.innerHTML = sortedTasks.map(task => 
            this.createTaskHTML(task)  // Vytvoří HTML pro jeden úkol
        ).join('');  // Spojí všechny HTML řetězce dohromady
        
        // Připojí event listenery k tlačítkům úkolů (dokončit, upravit, smazat)
        this.attachTaskEventListeners();
    }

    // ===== VYTVOŘENÍ HTML PRO JEDEN ÚKOL =====
    // Vygeneruje HTML kód pro zobrazení jednoho úkolu
    // @param {Object} task - Objekt úkolu
    // @returns {String} - HTML řetězec
    createTaskHTML(task) {
        // Formátování data do lidsky čitelné podoby
        const taskDate = new Date(task.date);
        const formattedDate = taskDate.toLocaleDateString('en-US', { 
            month: 'short',   // Zkrácený název měsíce (Jan, Feb...)
            day: 'numeric',   // Den v měsíci (1, 2, 3...)
            year: 'numeric'   // Rok (2024)
        });
        
        // Zobrazení času (pokud je zadán)
        const timeDisplay = task.time ? 
            `<span><i class="fas fa-clock"></i> ${task.time}</span>` : '';
        
        // Vrací HTML kód úkolu
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

    // ===== PŘIPOJENÍ LISTENERŮ K TLAČÍTKŮM ÚKOLŮ =====
    // Přidá event listenery k tlačítkům dokončit/upravit/smazat u každého úkolu
    attachTaskEventListeners() {
        // Najde všechna tlačítka s atributem data-action
        const actionButtons = this.tasksContainer.querySelectorAll('[data-action]');
        actionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.dataset.action;  // Typ akce (toggle/edit/delete)
                const id = btn.dataset.id;          // ID úkolu
                
                // Podle typu akce zavolá příslušnou metodu
                switch (action) {
                    case 'toggle':
                        this.toggleComplete(id);  // Přepnout dokončení
                        break;
                    case 'edit':
                        this.openModal(id);       // Otevřít pro úpravu
                        break;
                    case 'delete':
                        this.deleteTask(id);      // Smazat úkol
                        break;
                }
            });
        });
    }

    // ===== AKTUALIZACE STATISTIK =====
    // Vypočítá a zobrazí počty úkolů (celkem, dokončené, čekající)
    updateStats() {
        const total = this.tasks.length;                             // Celkový počet úkolů
        const completed = this.tasks.filter(t => t.completed).length; // Počet dokončených
        const pending = total - completed;                           // Počet čekajících
        
        // Aktualizuje čísla v UI
        this.totalTasksEl.textContent = total;
        this.completedTasksEl.textContent = completed;
        this.pendingTasksEl.textContent = pending;
    }

    // ===== SYNCHRONIZACE S GOOGLE KALENDÁŘEM =====
    // Placeholder pro budoucí implementaci Google Calendar API
    syncWithGoogleCalendar() {
        // Najde úkoly označené pro synchronizaci, které nejsou dokončené
        const tasksToSync = this.tasks.filter(t => t.syncGoogle && !t.completed);
        
        // Pokud nejsou žádné úkoly ke synchronizaci
        if (tasksToSync.length === 0) {
            alert('No tasks marked for Google Calendar sync.');
            return;
        }
        
        // V reálné implementaci by se zde volalo Google Calendar API
        // Prozatím pouze informační zpráva
        alert(`This feature will sync ${tasksToSync.length} task(s) with Google Calendar.\n\n` +
              'To implement:\n' +
              '1. Set up Google Calendar API credentials\n' +
              '2. Authenticate with Google OAuth 2.0\n' +
              '3. Create calendar events for each task\n\n' +
              'For now, this is a placeholder.');
    }

    // ===== GENEROVÁNÍ UNIKÁTNÍHO ID =====
    // Vytvoří unikátní ID pro nový úkol
    // @returns {String} - Unikátní ID (kombinace času a náhodného čísla)
    generateId() {
        // Kombinace aktuálního času (v base36) a náhodného čísla
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // ===== ESCAPE HTML =====
    // Ochrana před XSS útoky - převede speciální znaky na HTML entity
    // @param {String} text - Text k escapování
    // @returns {String} - Bezpečný HTML text
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;  // textContent automaticky escapuje HTML
        return div.innerHTML;     // Vrátí escapovaný text
    }

    // ===== ULOŽENÍ ÚKOLŮ DO FIREBASE =====
    // Uloží všechny úkoly do Firebase Realtime Database
    saveTasks() {
        console.log('💾 Ukládám úkoly do Firebase...', this.tasks);
        // Zavolá Firebase helper funkci z index.html
        window.firebaseHelpers.saveTasks(this.tasks)
            .then(() => console.log('✅ Úkoly uloženy do Firebase'))
            .catch(err => console.error('❌ Chyba při ukládání:', err));
    }

    // ===== NAČTENÍ ÚKOLŮ Z FIREBASE =====
    // Nastaví real-time listener pro úkoly v Firebase
    // Callback se volá pokaždé, když se úkoly změní
    loadTasksFromFirebase() {
        console.log('📥 Načítám úkoly z Firebase...');
        // Nastaví listener - volá se při každé změně dat
        window.firebaseHelpers.listenToTasks((tasks) => {
            console.log('✅ Úkoly načteny z Firebase:', tasks);
            // Uloží úkoly (kontrola, zda je to pole)
            this.tasks = Array.isArray(tasks) ? tasks : [];
            // Vykreslí úkoly na stránku
            this.renderTasks();
            // Aktualizuje statistiky
            this.updateStats();
        });
    }

    // ===== NAČTENÍ ÚKOLŮ Z LOCALSTORAGE (DEPRECATED) =====
    // Tato metoda je zastaralá - nyní používáme Firebase
    // Ponechána pro zpětnou kompatibilitu
    loadTasks() {
        const saved = localStorage.getItem('bweb-tasks');
        return saved ? JSON.parse(saved) : [];
    }
}

// ===== INICIALIZACE APLIKACE PŘI NAČTENÍ STRÁNKY =====
// Event listener - čeká, až se načte celý DOM (HTML), pak spustí aplikaci
document.addEventListener('DOMContentLoaded', () => {
    // Počká 500ms na inicializaci Firebase (asynchronní načítání)
    setTimeout(() => {
        // Kontrola, zda se Firebase inicializovalo správně
        if (window.firebaseHelpers) {
            // Nastaví listener pro změny přihlášení/odhlášení
            window.firebaseHelpers.onAuthChange((user) => {
                if (user) {
                    // UŽIVATEL JE PŘIHLÁŠEN
                    console.log('✅ Uživatel přihlášen:', user.email);
                    hideLoginModal();           // Skryje přihlašovací okno
                    new TaskManager();          // Spustí aplikaci (vytvoří instanci)
                    initLogout();               // Inicializuje odhlašovací tlačítko
                } else {
                    // UŽIVATEL NENÍ PŘIHLÁŠEN
                    console.log('❌ Uživatel není přihlášen');
                    showLoginModal();           // Zobrazí přihlašovací okno
                    initAuthForms();            // Inicializuje přihlašovací formuláře
                }
            });
        } else {
            // Chyba - Firebase se nepodařilo načíst
            console.error('❌ Firebase se nepodařilo inicializovat');
        }
    }, 500);  // Timeout 500ms
});

// ===== INICIALIZACE ODHLAŠOVACÍHO TLAČÍTKA =====
// Přidá funkčnost tlačítku pro odhlášení
function initLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            // Potvrzení před odhlášením
            if (confirm('Opravdu se chcete odhlásit?')) {
                try {
                    // Zavolá Firebase funkci pro odhlášení
                    await window.firebaseHelpers.signOut();
                    // Reload stránky (vrátí na přihlašovací obrazovku)
                    location.reload();
                } catch (error) {
                    console.error('Chyba při odhlášení:', error);
                    alert('Chyba při odhlášení');
                }
            }
        });
    }
}

// ===== POMOCNÉ FUNKCE PRO AUTENTIZAČNÍ MODÁL =====
// Zobrazí přihlašovací modální okno
function showLoginModal() {
    const loginModal = document.getElementById('login-modal');
    loginModal.classList.add('active');
}

// Skryje přihlašovací modální okno
function hideLoginModal() {
    const loginModal = document.getElementById('login-modal');
    loginModal.classList.remove('active');
}

// ===== INICIALIZACE PŘIHLAŠOVACÍCH FORMULÁŘŮ =====
// Přidá funkčnost přihlašovacímu a registračnímu formuláři
function initAuthForms() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    
    // Přepínání mezi přihlášením a registrací
    // Kliknutí na "Nemáte účet? Zaregistrujte se"
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';        // Skryje přihlašovací formulář
        registerForm.style.display = 'block';    // Zobrazí registrační formulář
    });
    
    // Kliknutí na "Už máte účet? Přihlaste se"
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.style.display = 'none';     // Skryje registrační formulář
        loginForm.style.display = 'block';       // Zobrazí přihlašovací formulář
    });
    
    // ===== ZPRACOVÁNÍ PŘIHLÁŠENÍ =====
    // Odeslání přihlašovacího formuláře
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();  // Zabrání reloadu stránky
        // Získá hodnoty z formuláře
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        try {
            // Zavolá Firebase funkci pro přihlášení
            await window.firebaseHelpers.signIn(email, password);
            alert('Přihlášení proběhlo úspěšně!');
            // Firebase onAuthChange listener se automaticky postará o zobrazení aplikace
        } catch (error) {
            console.error('Chyba přihlášení:', error);
            alert('Chyba při přihlášení: ' + error.message);
        }
    });
    
    // ===== ZPRACOVÁNÍ REGISTRACE =====
    // Odeslání registračního formuláře
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();  // Zabrání reloadu stránky
        // Získá hodnoty z formuláře
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const passwordConfirm = document.getElementById('register-password-confirm').value;
        
        // ===== VALIDACE =====
        // Kontrola, zda se hesla shodují
        if (password !== passwordConfirm) {
            alert('Hesla se neshodují!');
            return;
        }
        
        // Kontrola minimální délky hesla (Firebase požadavek)
        if (password.length < 6) {
            alert('Heslo musí mít alespoň 6 znaků');
            return;
        }
        
        try {
            // Zavolá Firebase funkci pro registraci
            await window.firebaseHelpers.signUp(email, password);
            alert('Registrace proběhla úspěšně!');
            // Firebase onAuthChange listener se automaticky postará o přihlášení
        } catch (error) {
            console.error('Chyba registrace:', error);
            alert('Chyba při registraci: ' + error.message);
        }
    });
}

