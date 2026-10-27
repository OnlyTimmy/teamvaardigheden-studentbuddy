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

function clearValidation() {
    taskError.textContent = '';
    taskInput.removeAttribute('aria-invalid');
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

    const taskItem = document.createElement('li');
    taskItem.textContent = taskText;
    taskList.append(taskItem);
    emptyMessage.hidden = true;

    taskInput.value = '';
    clearValidation();
    taskInput.focus();
});

taskInput.addEventListener('input', clearValidation);
