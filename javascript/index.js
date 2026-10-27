const navigationLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('main > section');

function updateNavigation(moveFocus = false) {
    const requestedSection = window.location.hash.slice(1) || 'home';
    const activeSection = Array.from(sections).find((section) => section.id === requestedSection)
        || document.querySelector('#home');

    sections.forEach((section) => {
        section.hidden = section !== activeSection;
    });

    navigationLinks.forEach((link) => {
        if (link.hash === `#${activeSection.id}`) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });

    const activeLink = Array.from(navigationLinks).find((link) => link.hash === `#${activeSection.id}`);
    document.title = `${activeLink.textContent} | StudentBuddy`;

    if (moveFocus) {
        activeSection.querySelector('h1').focus();
    }
}

window.addEventListener('hashchange', () => updateNavigation(true));
updateNavigation();

const taskForm = document.querySelector('.task-form');
const taskInput = document.querySelector('#task-input');
const taskError = document.querySelector('#task-error');
const taskList = document.querySelector('.task-list');
const emptyMessage = document.querySelector('.empty-message');
let nextTaskId = 0;

function clearValidation() {
    taskError.textContent = '';
    taskInput.removeAttribute('aria-invalid');
}

function updateEmptyMessage() {
    emptyMessage.hidden = taskList.children.length > 0;
}

function createTaskItem(taskText) {
    const taskId = `task-${nextTaskId}`;
    nextTaskId += 1;

    const taskItem = document.createElement('li');
    taskItem.className = 'task-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = taskId;
    checkbox.className = 'task-checkbox';
    checkbox.setAttribute('aria-label', `Markeer "${taskText}" als voltooid`);

    const taskLabel = document.createElement('label');
    taskLabel.className = 'task-text';
    taskLabel.htmlFor = taskId;
    taskLabel.textContent = taskText;

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'delete-task';
    deleteButton.textContent = 'Verwijderen';
    deleteButton.setAttribute('aria-label', `Verwijder taak "${taskText}"`);

    taskItem.append(checkbox, taskLabel, deleteButton);
    return taskItem;
}

taskForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const taskText = taskInput.value.trim();

    if (taskText.length === 0) {
        taskError.textContent = 'Vul een taak in voordat je deze toevoegt.';
        taskInput.setAttribute('aria-invalid', 'true');
        taskInput.focus();
        return;
    }

    taskList.append(createTaskItem(taskText));
    updateEmptyMessage();

    taskInput.value = '';
    clearValidation();
    taskInput.focus();
});

taskList.addEventListener('change', (event) => {
    if (!(event.target instanceof HTMLInputElement) || !event.target.matches('.task-checkbox')) {
        return;
    }

    event.target.closest('.task-item').classList.toggle('completed', event.target.checked);
});

taskList.addEventListener('click', (event) => {
    if (!(event.target instanceof HTMLButtonElement) || !event.target.matches('.delete-task')) {
        return;
    }

    event.target.closest('.task-item').remove();
    updateEmptyMessage();
});

taskInput.addEventListener('input', clearValidation);
