//toggle theme
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
const btnConfirmAdd = document.querySelector('.modal__btn-save'); // btn apply
const btnCancelAdd = document.querySelector('.modal__btn-cancel'); // btn cancel
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
let currentEditIndex = null;
let currentFilter = 'uncompleted';

function updatePlaceholder() {
    if (tasks.length > 0) {
        plug.classList.add('hidden');
        clearBtn.classList.remove('hidden');
    } else {
        plug.classList.remove('hidden');
        clearBtn.classList.add('hidden');
    }
}

function createTaskButtons() {
    const SVG_NS = 'http://www.w3.org/2000/svg';

    const editTaskBtn = document.createElement('button');
    editTaskBtn.className = 'btn task__btn-edit';

    /*create svg*/
    const editIcon = document.createElementNS(SVG_NS, 'svg');
    editIcon.setAttribute('width', '18');
    editIcon.setAttribute('height', '18');
    editIcon.classList.add('task__icon-edit');

    const editUse = document.createElementNS(SVG_NS, 'use');
    editUse.setAttribute('href', './fonts/sprite/sprite.svg#edit');
    editIcon.appendChild(editUse);
    editTaskBtn.appendChild(editIcon);

    const deleteTaskBtn = document.createElement('button');
    deleteTaskBtn.className = 'btn task__btn-trash';

    const deleteIcon = document.createElementNS(SVG_NS, 'svg');
    deleteIcon.setAttribute('width', '18');
    deleteIcon.setAttribute('height', '18');
    deleteIcon.classList.add('task__icon-trash');
    const deleteUse = document.createElementNS(SVG_NS, 'use');
    deleteUse.setAttribute('href', './fonts/sprite/sprite.svg#trash');
    deleteIcon.appendChild(deleteUse);
    deleteTaskBtn.appendChild(deleteIcon);

    const checkboxIcon = document.createElementNS(SVG_NS, 'svg');
    checkboxIcon.setAttribute('width', '26');
    checkboxIcon.setAttribute('height', '26');
    checkboxIcon.classList.add('btn__icon', 'current-checkbox');
    const checkboxUse = document.createElementNS(SVG_NS, 'use');
    checkboxUse.setAttribute('href', './fonts/sprite/sprite.svg#checkbox');
    checkboxIcon.appendChild(checkboxUse);

    const checkIcon = document.createElementNS(SVG_NS, 'svg');
    checkIcon.setAttribute('width', '15');
    checkIcon.setAttribute('height', '15');
    checkIcon.classList.add('btn__icon', 'active-check');
    const checkUse = document.createElementNS(SVG_NS, 'use');
    checkUse.setAttribute('href', './fonts/sprite/sprite.svg#check');
    checkIcon.appendChild(checkUse);

    return {editTaskBtn, deleteTaskBtn, checkIcon, checkboxIcon};
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
    const {checkIcon, checkboxIcon} = createTaskButtons();
    label.appendChild(checkboxIcon);
    label.appendChild(checkIcon);

    listItem.appendChild(label);

    // Текст в спан
    const textSpan = document.createElement('span');
    textSpan.classList.add('task__text');
    textSpan.textContent = taskStorage.title;
    listItem.appendChild(textSpan);

    // Кнопки управления задачей
    const {editTaskBtn, deleteTaskBtn} = createTaskButtons();// Получаем кнопки из функции createTaskButtons
    listItem.appendChild(editTaskBtn);
    listItem.appendChild(deleteTaskBtn);

    if (taskStorage.completed) {
        checkbox.checked = true;
        listItem.classList.add('completed');
        editTaskBtn.classList.add('hidden');
        deleteTaskBtn.classList.add('hidden');
    }

    checkbox.addEventListener('change', () => {
        taskStorage.completed = checkbox.checked;
        listItem.classList.toggle('completed', checkbox.checked);
        editTaskBtn.classList.toggle('hidden', checkbox.checked);
        deleteTaskBtn.classList.toggle('hidden', checkbox.checked);

        saveTask();
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

    filteredTasks.forEach(renderTask)
}

function openModalNewTask() {
    currentEditIndex = null;
    inputTask.value = '';
    inputTask.placeholder = 'Введите новую задачу...';

    const title = document.querySelector('h2');
    title.textContent = 'Создать новую задачу';
    btnConfirmAdd.classList.remove('hidden');
    btnConfirmEdit.classList.add('modal__btn-save--hidden');

    modal.classList.remove('modal--hidden');
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
        id: '',
        title: '',
        completed: false
    }
    const value = inputTask.value.trim();
    if (value === '') return;
    taskData.title = value;
    taskData.id = uniqueId;
    console.log(taskData)
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

        const textSpan = taskItem.querySelector('.task__text');
        const taskText = textSpan ? textSpan.textContent.trim() : '';

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
        title.textContent = 'Редактирование задачи';
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
})

filterAndRenderTasks();
updatePlaceholder();
