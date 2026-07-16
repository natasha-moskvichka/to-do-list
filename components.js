export function createTaskButtons() {
    const SVG_NS = 'http://www.w3.org/2000/svg';

    const editTaskBtn = document.createElement('button');
    editTaskBtn.className = 'btn task__btn-edit';
    editTaskBtn.ariaLabel = 'Редактировать задачу';

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
    deleteTaskBtn.ariaLabel = 'Удалить задачу';

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

    const importantBtn = document.createElement('button');
    const importantSpan = document.createElement('span');
    importantBtn.className = 'btn task__btn-status';
    importantSpan.className = 'task__span-status';
    importantBtn.appendChild(importantSpan);
    importantBtn.ariaLabel = 'Отметить задачу как важную';

    return {editTaskBtn, deleteTaskBtn, checkIcon, checkboxIcon, importantBtn};
}
