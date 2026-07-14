//toggle theme
const html = document.documentElement;
const toggleBtn = document.querySelector('.theme');

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

const container = document.querySelector('.container');
const openModalBtn = container.querySelector('.btn-add');
const overlay = document.querySelector('.container-overlay');
const tasksList = container.querySelector('.my-task');
const btnConfirmAdd = document.querySelector('.btn-add__new'); // btn apply
const btnCancelAdd = document.querySelector('.btn-delete__new'); // btn cancel
const inputTask = document.querySelector('.input-new-value');
const clearBtn = document.querySelector('.clear');
const plug = container.querySelector('.tasks-empty');
const search = container.querySelector('#input-search');
const btnSearchTask = container.querySelector('.btn-search');
const btnSelectTask = container.querySelector('.btn-select');
const dropdown = container.querySelector('.dropdown');
const chevron = container.querySelector('.chevron');
const btnSaveEdit = document.querySelector('#btnSaveEdit');
let currentEditIndex = null;

function updatePlaceholder() {
    if (tasks.length > 0) {
        plug.classList.add('hidden');
    } else {
        plug.classList.remove('hidden');
    }
}

function createTaskButtons() {
    const SVG_NS = 'http://www.w3.org/2000/svg';

    const editTaskBtn = document.createElement('button');
    editTaskBtn.className = 'btn btn-default btn-edit';

    /*create svg*/
    const editIcon = document.createElementNS(SVG_NS, 'svg');
    editIcon.setAttribute('width', '18');
    editIcon.setAttribute('height', '18');
    editIcon.classList.add('icon', 'edit');

    const editUse = document.createElementNS(SVG_NS, 'use');
    editUse.setAttribute('href', './fonts/sprite/sprite.svg#edit');
    editIcon.appendChild(editUse);
    editTaskBtn.appendChild(editIcon);

    const deleteTaskBtn = document.createElement('button');
    deleteTaskBtn.className = 'btn btn-default btn-trash';

    const deleteIcon = document.createElementNS(SVG_NS, 'svg');
    deleteIcon.setAttribute('width', '18');
    deleteIcon.setAttribute('height', '18');
    deleteIcon.classList.add('icon', 'trash');
    const deleteUse = document.createElementNS(SVG_NS, 'use');
    deleteUse.setAttribute('href', './fonts/sprite/sprite.svg#trash');
    deleteIcon.appendChild(deleteUse);
    deleteTaskBtn.appendChild(deleteIcon);

    const checkboxIcon = document.createElementNS(SVG_NS, 'svg');
    checkboxIcon.setAttribute('width', '26');
    checkboxIcon.setAttribute('height', '26');
    checkboxIcon.classList.add('icon', 'current-checkbox');
    const checkboxUse = document.createElementNS(SVG_NS, 'use');
    checkboxUse.setAttribute('href', './fonts/sprite/sprite.svg#checkbox');
    checkboxIcon.appendChild(checkboxUse);

    const checkIcon = document.createElementNS(SVG_NS, 'svg');
    checkIcon.setAttribute('width', '15');
    checkIcon.setAttribute('height', '15');
    checkIcon.classList.add('icon', 'active-check');
    const checkUse = document.createElementNS(SVG_NS, 'use');
    checkUse.setAttribute('href', './fonts/sprite/sprite.svg#check');
    checkIcon.appendChild(checkUse);

    return {editTaskBtn, deleteTaskBtn, checkIcon, checkboxIcon};
}

function createTaskLi(text) {
    const listItem = document.createElement('li');
    listItem.className = 'task';

    const uniqueId = 'todo-' + Date.now() + Math.random().toString(36).slice(2, 4);

    const checkbox = document.createElement('input');
    checkbox.className = 'checkbox visually-hidden';
    checkbox.type = 'checkbox';
    checkbox.id = uniqueId;
    listItem.appendChild(checkbox);

    //label
    const label = document.createElement('label');
    label.htmlFor = uniqueId;
    label.className = 'checkbox-label';

    // Получаем иконки для чекбокса
    const {checkIcon, checkboxIcon} = createTaskButtons();
    label.appendChild(checkboxIcon);
    label.appendChild(checkIcon);

    listItem.appendChild(label);

    // Текст в спан
    const textSpan = document.createElement('span');
    textSpan.classList.add('task-text');
    textSpan.textContent = text;
    listItem.appendChild(textSpan);

    // Кнопки управления задачей
    const {editTaskBtn, deleteTaskBtn} = createTaskButtons();// Получаем кнопки из функции createTaskButtons
    listItem.appendChild(editTaskBtn);
    listItem.appendChild(deleteTaskBtn);

    checkbox.addEventListener('change', () => {
        listItem.classList.toggle('completed', checkbox.checked);
        editTaskBtn.classList.toggle('hidden', checkbox.checked);
        deleteTaskBtn.classList.toggle('hidden', checkbox.checked);
    });

    return listItem;
}

function renderTask(text) { //  это шаблон, который создает задачу на основе переданного текста
    const fullTaskRow = createTaskLi(text);
    tasksList.appendChild(fullTaskRow);
}

function saveTask() {
    localStorage.setItem('tasks', JSON.stringify(tasks));// Внутри функции она читает переменную tasks (которая объявлена снаружи), и обязательно ей ничего не нужно передавать — она работает с глобальной или замкнутой переменной
}

function onHandlerSave() {
    const value = inputTask.value.trim();
    if (value === '' || currentEditIndex === null) return;

    tasks[currentEditIndex] = value; // обновляем задачу в массиве данных
    localStorage.setItem('tasks', JSON.stringify(tasks)); // Сохраняем обновленный массив в localStorage

    const taskElements = document.querySelectorAll('.task');
    const taskDom = taskElements[currentEditIndex];

    if (taskDom) {
        const textSpan = taskDom.querySelector('.task-text');
        if (textSpan) {
            textSpan.textContent = value;
        }
    }

    inputTask.value = '';
    overlay.classList.add('hidden');
    updatePlaceholder();
}

function searchTask() {
    const searchTaskValue = search.value.trim().toLowerCase();

    const taskElements = tasksList.querySelectorAll('.task');

    taskElements.forEach(taskElement => {
        const taskText = taskElement.textContent ? taskElement.textContent.trim().toLowerCase() : '';

        console.log(taskText)
        if (searchTaskValue === '') {
            return;
        }

        if (taskText.includes(searchTaskValue)) {
            taskElement.classList.add('current-task');
        }

    })
}

function selectTask() {
    // btnSelectTask.classList.toggle('active');
    // dropdown.classList.remove('hidden');
    // chevron.style.transform = 'rotate(0)'
}

function openModalNewTask () {
    currentEditIndex = null;
    inputTask.value = '';
    inputTask.placeholder = 'Введите новую задачу...';

    const title = document.querySelector('h2');
    title.textContent = 'Создать новую задачу';

    btnConfirmAdd.classList.remove('hidden');
    btnSaveEdit.classList.add('hidden');

    overlay.classList.remove('hidden');
}

btnSelectTask.addEventListener('click', selectTask);

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
    overlay.classList.add('hidden');
    updatePlaceholder();
})

btnConfirmAdd.addEventListener('click', () => {
    const value = inputTask.value.trim();
    if (value === '') return;
    tasks.push(value);
    saveTask(); // Вызов saveTasks() — просто говорит: "сохранить текущее состояние массива tasks"
    renderTask(value); // конкретно говорит: "Создай задачу для текста value"
    inputTask.value = '';
    overlay.classList.add('hidden');
    updatePlaceholder();
});

btnSaveEdit.addEventListener('click', onHandlerSave);

tasksList.addEventListener('click', (e) => {
    const targetElem = e.target;
    const trashBtn = targetElem.closest('.btn-trash');
    const editBtn = targetElem.closest('.btn-edit');

    if (trashBtn) {
        const taskItem = trashBtn.closest('.task');
        if (!taskItem) return;

        const textSpan = taskItem.querySelector('.task-text');
        const taskText = textSpan ? textSpan.textContent.trim() : '';

        const index = tasks.findIndex(task => task === taskText);

        if (index !== -1) { // splice -1 === false,
            tasks.splice(index, 1) // удалить с позиции индекса 1 элемент

            localStorage.setItem('tasks', JSON.stringify(tasks));
            taskItem.remove(); // delete from DOM
        }
    } else if (editBtn) {
        /*редактирование текущей задачи*/
        const editTask = editBtn.closest('.task');

        if (!editTask) return;

        const textSpan = editTask.querySelector('.task-text');
        const editTaskText = textSpan ? textSpan.textContent.trim() : '';

        const index = tasks.findIndex(currentTask => currentTask === editTaskText);
        if (index !== -1) {
            currentEditIndex = index;
        }

        overlay.classList.remove('hidden');

        const title = document.querySelector('h2');
        title.textContent = 'Редактирование задачи';
        inputTask.placeholder = editTaskText;
        inputTask.value = editTaskText;

        // const saveEditTask = document.createElement('button');
        // const saveEditTaskText = document.createElement('span');
        // saveEditTask.classList.add('btn');
        // saveEditTask.classList.add('btn-fill');
        // saveEditTaskText.classList.add('btn-text');
        // saveEditTaskText.textContent = 'Save';
        // saveEditTask.appendChild(saveEditTaskText);
        // controlBtn.appendChild(saveEditTask);

btnConfirmAdd.classList.add('hidden');
btnSaveEdit.classList.remove('hidden');
        //saveEditTask.addEventListener('click', onHandlerSave);
    }

    updatePlaceholder();
})

tasks.forEach(renderTask); //для каждого элемента вызывай функцию
updatePlaceholder();

