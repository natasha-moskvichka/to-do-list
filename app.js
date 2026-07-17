import {createTaskButtons} from "./components.js";
import {translations} from "./languages.js";

let currentLanguage = localStorage.getItem('todo-lang') || 'ru';

const html = document.documentElement;
const toggleBtn = document.querySelector('.toolbar__theme-btn');

const saveTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', saveTheme);

function toggleTheme() {
    let currentTheme = html.getAttribute('data-theme');
    let newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

toggleBtn.addEventListener('click', toggleTheme);

let tasks = JSON.parse(localStorage.getItem('tasks') || '[]'); // беру из браузера список задач, который там был сохранен

const container = document.querySelector('.todo');
const openModalBtn = container.querySelector('.actions__add-btn');
const modal = document.querySelector('.modal');
const tasksList = container.querySelector('.tasks-list__items');
const btnConfirmAdd = document.querySelector('.modal__btn-save');
const btnCancelAdd = document.querySelector('.modal__btn-cancel');
const inputTask = document.querySelector('.modal__input');
const clearBtn = document.querySelector('.actions__clear-btn');
const plug = container.querySelector('.task-list__empty');
const search = container.querySelector('#input-search');
const btnSearchTask = container.querySelector('.search__button');
const btnSelectTask = container.querySelector('.filter__button');
const btnConfirmEdit = document.querySelector('#btnSaveEdit');
const filterBtns = container.querySelectorAll('.filter__item');
const filterDropdown = container.querySelector('.filter__dropdown');
const btnChevron = container.querySelector('.btn__chevron');
const btnChangeLanguage = container.querySelector('.btn-lang');
const celebrationModal = document.querySelector('#celebrationModal');
const btnCloseCelebration = document.querySelector('#btnCloseCelebration');

let currentEditIndex = null;
let currentFilter = 'all';

function updatePlaceholder() {
    if (tasks.length > 0) {
        plug.classList.add('hidden');
        clearBtn.classList.remove('hidden');
        // btnSelectTask.classList.remove('hidden');
    } else {
        plug.classList.remove('hidden');
        clearBtn.classList.add('hidden');
        //btnSelectTask.classList.add('hidden');
    }
}

function createTaskLi(taskStorage) {
    const listItem = document.createElement('li');
    listItem.className = 'tasks-list__items-cell task';

    const checkbox = document.createElement('input');
    checkbox.className = 'checkbox visually-hidden';
    checkbox.type = 'checkbox';
    checkbox.id = taskStorage.id;
    listItem.appendChild(checkbox);

    //label
    const label = document.createElement('label');
    label.className = 'checkbox-label';
    label.htmlFor = taskStorage.id;

    // Получаем иконки для чекбокса
    const {checkIcon, checkboxIcon} = createTaskButtons(currentLanguage);
    label.appendChild(checkboxIcon);
    label.appendChild(checkIcon);

    listItem.appendChild(label);

    // Текст в спан
    const textSpan = document.createElement('span');
    textSpan.classList.add('task__text');
    textSpan.textContent = taskStorage.title;
    listItem.appendChild(textSpan);

    // Кнопки управления задачей
    const {editTaskBtn, deleteTaskBtn, importantBtn} = createTaskButtons(currentLanguage);// Получаем кнопки из функции createTaskButtons
    listItem.appendChild(importantBtn);
    listItem.appendChild(editTaskBtn);
    listItem.appendChild(deleteTaskBtn);

    if (taskStorage.completed) {
        checkbox.checked = true;
        listItem.classList.add('completed');
        editTaskBtn.classList.add('hidden');
        deleteTaskBtn.classList.add('hidden');
        importantBtn.classList.add('hidden');
    }

    if (taskStorage.status === 'important') {
        listItem.classList.add('task--important')
    }

    importantBtn.addEventListener('click', () => {
        if (taskStorage.status === 'important') {
            taskStorage.status = 'normal';
            importantBtn.ariaLabel = 'Отметить задачу как важную';
        } else {
            taskStorage.status = 'important';
            importantBtn.ariaLabel = 'Убрать отметку важности';
        }

        listItem.classList.toggle('task--important', taskStorage.status === 'important');

        saveTask();
    })

    checkbox.addEventListener('change', () => {
        taskStorage.completed = checkbox.checked;
        listItem.classList.toggle('completed', checkbox.checked);
        editTaskBtn.classList.toggle('hidden', checkbox.checked);
        deleteTaskBtn.classList.toggle('hidden', checkbox.checked);
        importantBtn.classList.toggle('hidden', checkbox.checked);

        saveTask();

        const isAllCompleted = tasks.length > 0 && tasks.every(task => task.completed === true);
        if (isAllCompleted === true) {
            celebrationModal.classList.remove('modal--hidden');
            confetti({zIndex: 99999});
        }
    });

    return listItem;
}

function renderTask(taskStorage) {
    const fullTaskRow = createTaskLi(taskStorage)
    tasksList.appendChild(fullTaskRow); // в ul вставляю li
}

function saveTask() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function onHandlerSave() {
    const value = inputTask.value.trim();
    if (value === '' || currentEditIndex === null) return;

    tasks[currentEditIndex] = value;
    localStorage.setItem('tasks', JSON.stringify(tasks));

    const taskElements = document.querySelectorAll('.task');
    const taskDom = taskElements[currentEditIndex];

    if (taskDom) {
        const textSpan = taskDom.querySelector('.task__text');
        if (textSpan) {
            textSpan.textContent = value;
        }
    }

    inputTask.value = '';
    modal.classList.add('modal--hidden');
    updatePlaceholder();
}

function searchTask() {
    const searchTaskValue = search.value.trim().toLowerCase();

    const taskElements = tasksList.querySelectorAll('.task');

    taskElements.forEach(taskElement => {
        const taskText = taskElement.textContent ? taskElement.textContent.trim().toLowerCase() : '';

        if (searchTaskValue === '') {
            return;
        }

        if (taskText.includes(searchTaskValue)) {
            taskElement.classList.add('current-task');
        }

    })
}

function filterAndRenderTasks() {
    tasksList.innerHTML = '';

    const filteredTasks = tasks.filter(elem => {
        if (currentFilter === 'all') {
            return true;
        }
        if (currentFilter === 'completed') {
            return elem.completed === true;
        }
        if (currentFilter === 'uncompleted') {
            return elem.completed === false;
        }
    })

    filteredTasks.forEach(renderTask);
}

function openModalNewTask() {
    currentEditIndex = null;
    inputTask.value = '';
    inputTask.placeholder = translations[currentLanguage].inputPlaceholderTask;

    const title = document.querySelector('h2');
    title.textContent = translations[currentLanguage].capture;
    btnConfirmAdd.classList.remove('hidden');
    btnConfirmEdit.classList.add('modal__btn-save--hidden');

    modal.classList.remove('modal--hidden');
}

if (clearBtn) {
    clearBtn.textContent = translations[currentLanguage].btnClearAll;
}

function changeLanguage() {
    document.documentElement.lang = currentLanguage;

    const title = document.querySelector('.todo__title');
    const btnTextLang = document.querySelector('.btn__text');
    const searchInput = document.querySelector('.search__input');
    const filterAll = document.querySelector('[data-filter="all"]');
    const filterCompleted = document.querySelector('[data-filter="completed"]');
    const filterUncompleted = document.querySelector('[data-filter="uncompleted"]');
    const filterBtnText = btnSelectTask.querySelector('.btn__text');

    const capture = document.querySelector('#celebrationModal .modal__title');
    const simpleModal = document.querySelector('#simpleModal .modal__title');
    const modalText = document.querySelector('#celebrationModal .modal__text');
    const emptyText = document.querySelector('.task-list__empty-text');
    const btnCancelText = document.querySelector('.modal__btn-cancel .btn__text');
    const btnSaveText = document.querySelector('.modal__btn-save .btn__text');
    const btnSaveNewTask = document.querySelector('#btnSaveEdit .btn__text');
    const btnCelebrationText = btnCloseCelebration.querySelector('.btn__text');

    if (capture) {
        capture.textContent = translations[currentLanguage].titleSuccess;
    }

    if (emptyText) {
        emptyText.textContent = translations[currentLanguage].plug;
    }

    if (simpleModal) {
        simpleModal.textContent = translations[currentLanguage].capture;
    }

    title.textContent = translations[currentLanguage].title;
    btnTextLang.textContent = translations[currentLanguage].btnLang;
    searchInput.placeholder = translations[currentLanguage].inputPlaceholderSearch;
    filterAll.textContent = translations[currentLanguage].filtersAll;
    filterCompleted.textContent = translations[currentLanguage].filterCompleted;
    filterUncompleted.textContent = translations[currentLanguage].filterUncompleted;
    filterBtnText.textContent = translations[currentLanguage].btnAllTasks;
    capture.textContent = translations[currentLanguage].titleSuccess;
    modalText.textContent = translations[currentLanguage].textSuccess;
    simpleModal.textContent = translations[currentLanguage].capture;
    btnCancelText.textContent = translations[currentLanguage].btnCancel;
    btnSaveText.textContent = translations[currentLanguage].btnSave;
    btnSaveNewTask.textContent = translations[currentLanguage].btnSave;
    btnCelebrationText.textContent = translations[currentLanguage].btnSuccess;
    emptyText.textContent = translations[currentLanguage].plug;

    if (clearBtn) {
        clearBtn.textContent = translations[currentLanguage].btnClearAll;
    }
}

btnChangeLanguage.addEventListener('click', () => {
    if (currentLanguage === 'ru') {
        currentLanguage = 'en';
    } else {
        currentLanguage = 'ru';
    }
    localStorage.setItem('todo-lang', currentLanguage);

    changeLanguage();
});

if (clearBtn) {
    clearBtn.textContent = translations[currentLanguage].btnClearAll;
}

btnSelectTask.addEventListener('click', () => {
    filterDropdown.classList.toggle('hidden');
    btnChevron.classList.toggle('rotate');
});
btnSearchTask.addEventListener('click', searchTask);

clearBtn.addEventListener('click', () => {
    tasks = [];
    localStorage.setItem('tasks', JSON.stringify(tasks));
    tasksList.innerHTML = '';

    updatePlaceholder();
})

openModalBtn.addEventListener('click', openModalNewTask)

btnCancelAdd.addEventListener('click', () => {
    inputTask.value = '';
    modal.classList.add('modal--hidden');
    updatePlaceholder();
})

/*добавление новой задачи*/
btnConfirmAdd.addEventListener('click', () => {
    const uniqueId = 'todo-' + Date.now() + Math.random().toString(36).slice(2, 4);

    let taskData = {
        id: uniqueId,
        title: '',
        status: 'normal',
        completed: false
    }
    const value = inputTask.value.trim();
    if (value === '') return;
    taskData.title = value;
    taskData.id = uniqueId;
    tasks.push(taskData);
    saveTask();
    renderTask(taskData);
    inputTask.value = '';
    modal.classList.add('modal--hidden');
    updatePlaceholder();
});

btnConfirmEdit.addEventListener('click', onHandlerSave);

tasksList.addEventListener('click', (e) => {
    const targetElem = e.target;
    const trashBtn = targetElem.closest('.task__btn-trash');
    const editBtn = targetElem.closest('.task__btn-edit');

    if (trashBtn) {
        const taskItem = trashBtn.closest('.task');
        if (!taskItem) return;

        //const textSpan = taskItem.querySelector('.task__text');
        //const taskText = textSpan ? textSpan.textContent.trim() : '';

        //const index = tasks.findIndex(task => task === taskText);
        const taskElements = Array.from(tasksList.querySelectorAll('.task'));
        const index = taskElements.indexOf(taskItem);

        if (index !== -1) {
            tasks.splice(index, 1);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            taskItem.remove();
        }
    } else if (editBtn) {
        /*редактирование текущей задачи*/
        const editTask = editBtn.closest('.task');

        if (!editTask) return;

        const textSpan = editTask.querySelector('.task__text');
        const editTaskText = textSpan ? textSpan.textContent.trim() : '';

        //const index = tasks.findIndex(currentTask => currentTask === editTaskText);
        const taskElements = Array.from(tasksList.querySelectorAll('.task'));
        currentEditIndex = taskElements.indexOf(editTask);

        modal.classList.remove('modal--hidden');

        const title = document.querySelector('h2');
        title.textContent = translations[currentLanguage].modalCapture;
        inputTask.placeholder = editTaskText;
        inputTask.value = editTaskText;

        btnConfirmAdd.classList.add('hidden');
        btnConfirmEdit.classList.remove('modal__btn-save--hidden');
    }

    updatePlaceholder();
});

filterBtns.forEach(filterBtn => {
    filterBtn.addEventListener('click', (e) => {
        currentFilter = e.target.getAttribute('data-filter');
        filterAndRenderTasks();

        filterDropdown.classList.add('hidden');
        btnChevron.classList.remove('hidden');
    });
});

btnCloseCelebration.addEventListener('click', () => {
    celebrationModal.classList.add('modal--hidden');
})

changeLanguage();
filterAndRenderTasks();
updatePlaceholder();
