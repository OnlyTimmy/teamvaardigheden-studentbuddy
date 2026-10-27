import { studyTips } from './study-tips.js';
import { relaxationExercises } from './relaxation-exercises.js';

const navigationLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('main > section');
const studyTipsList = document.querySelector('#study-tips-list');

studyTips.forEach(({ title, explanation }) => {
    const tip = document.createElement('li');
    tip.className = 'study-tip';

    const tipTitle = document.createElement('h2');
    tipTitle.textContent = title;

    const tipExplanation = document.createElement('p');
    tipExplanation.textContent = explanation;

    tip.append(tipTitle, tipExplanation);
    studyTipsList.append(tip);
});

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

const exercisePlayer = document.querySelector('#exercise-player');
const exerciseTitle = document.querySelector('#exercise-title');
const exerciseDescription = document.querySelector('#exercise-description');
const exerciseTimer = document.querySelector('#exercise-timer');
const exerciseInstruction = document.querySelector('#exercise-instruction');
const exerciseVisual = document.querySelector('#exercise-visual');
const exerciseVisualLabel = document.querySelector('#exercise-visual-label');
const exerciseProgress = document.querySelector('#exercise-progress');
const exerciseProgressBar = exerciseProgress.querySelector('span');
const exerciseStatus = document.querySelector('.exercise-status');
const stopExerciseButton = document.querySelector('#stop-exercise');
const restartExerciseButton = document.querySelector('#restart-exercise');
const startExerciseButtons = document.querySelectorAll('[data-start-exercise]');
let activeExercise = null;
let exerciseTimerId = null;
let exerciseStartedAt = 0;
let activePhaseIndex = -1;

function getExerciseDuration(exercise) {
    return exercise.phases.reduce((total, phase) => total + phase.duration, 0);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function setSelectedExercise(exerciseId) {
    document.querySelectorAll('[data-exercise-card]').forEach((card) => {
        card.classList.toggle('is-selected', card.dataset.exerciseCard === exerciseId);
    });
}

function showExercisePhase(phase, phaseIndex) {
    if (phaseIndex === activePhaseIndex) {
        return;
    }

    activePhaseIndex = phaseIndex;
    exerciseInstruction.textContent = phase.instruction;
    exerciseVisualLabel.textContent = phase.label;
    exerciseVisual.dataset.state = phase.visualState;
    exerciseVisual.style.setProperty('--phase-duration', `${phase.duration}s`);
}

function finishExercise() {
    window.clearInterval(exerciseTimerId);
    exerciseTimerId = null;
    exerciseStatus.textContent = 'Oefening voltooid';
    exerciseTimer.textContent = '0:00';
    exerciseInstruction.textContent = 'Goed gedaan. Neem dit rustige gevoel mee naar je volgende taak.';
    exerciseVisualLabel.textContent = 'Klaar!';
    exerciseVisual.dataset.state = 'complete';
    exerciseProgress.setAttribute('aria-valuenow', '100');
    exerciseProgressBar.style.width = '100%';
    stopExerciseButton.disabled = true;
}

function updateExercise() {
    const totalDuration = getExerciseDuration(activeExercise);
    const elapsed = Math.floor((Date.now() - exerciseStartedAt) / 1000);

    if (elapsed >= totalDuration) {
        finishExercise();
        return;
    }

    let phaseStart = 0;
    const phaseIndex = activeExercise.phases.findIndex((phase) => {
        if (elapsed < phaseStart + phase.duration) {
            return true;
        }
        phaseStart += phase.duration;
        return false;
    });

    showExercisePhase(activeExercise.phases[phaseIndex], phaseIndex);

    const remaining = totalDuration - elapsed;
    const progress = Math.round((elapsed / totalDuration) * 100);
    exerciseTimer.textContent = formatTime(remaining);
    exerciseProgress.setAttribute('aria-valuenow', progress.toString());
    exerciseProgressBar.style.width = `${progress}%`;
}

function startExercise(exerciseId, moveFocus = true) {
    const selectedExercise = relaxationExercises.find((exercise) => exercise.id === exerciseId);
    if (!selectedExercise) {
        return;
    }

    window.clearInterval(exerciseTimerId);
    activeExercise = selectedExercise;
    exerciseStartedAt = Date.now();
    activePhaseIndex = -1;

    exercisePlayer.hidden = false;
    exerciseTitle.textContent = activeExercise.title;
    exerciseDescription.textContent = activeExercise.description;
    exerciseStatus.textContent = 'Oefening bezig';
    exerciseVisual.className = `exercise-visual exercise-visual--${activeExercise.id}`;
    exerciseProgress.setAttribute('aria-valuenow', '0');
    exerciseProgressBar.style.width = '0%';
    stopExerciseButton.disabled = false;
    setSelectedExercise(activeExercise.id);
    updateExercise();
    exerciseTimerId = window.setInterval(updateExercise, 250);

    if (moveFocus) {
        exercisePlayer.focus();
    }
}

function stopExercise() {
    if (!exerciseTimerId) {
        return;
    }

    window.clearInterval(exerciseTimerId);
    exerciseTimerId = null;
    exerciseStatus.textContent = 'Oefening beëindigd';
    exerciseInstruction.textContent = 'Je hebt de oefening beëindigd. Start opnieuw of kies een andere oefening.';
    exerciseVisualLabel.textContent = 'Gestopt';
    exerciseVisual.dataset.state = 'stopped';
    stopExerciseButton.disabled = true;
}

startExerciseButtons.forEach((button) => {
    button.addEventListener('click', () => startExercise(button.dataset.startExercise));
});

stopExerciseButton.addEventListener('click', stopExercise);
restartExerciseButton.addEventListener('click', () => startExercise(activeExercise.id, false));

window.addEventListener('hashchange', () => {
    if (window.location.hash !== '#ontspanning') {
        stopExercise();
    }
});
