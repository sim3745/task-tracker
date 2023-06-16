// Get references to the task list, buttons, and input field
const taskList = document.querySelector('.task-list');
const todoTasksBtn = document.querySelector('.task-buttons button:nth-child(1)');
const completedTasksBtn = document.querySelector('.task-buttons button:nth-child(2)');
const taskInput = document.getElementById('task-input');

// Function to show only the "To-Do Tasks"
function showTodoTasks() {
  // Hide completed tasks
  const completedTasks = document.querySelectorAll('.task.completed');
  completedTasks.forEach(task => {
    task.classList.add('hidden');
  });

  // Show to-do tasks
  const todoTasks = document.querySelectorAll('.task:not(.completed)');
  todoTasks.forEach(task => {
    task.classList.remove('hidden');
  });
}

// Function to show only the "Completed Tasks"
function showCompletedTasks() {
  // Hide to-do tasks
  const todoTasks = document.querySelectorAll('.task:not(.completed)');
  todoTasks.forEach(task => {
    task.classList.add('hidden');
  });

  // Show completed tasks
  const completedTasks = document.querySelectorAll('.task.completed');
  completedTasks.forEach(task => {
    task.classList.remove('hidden');
  });
}

// Function to handle task creation
function addTask() {
  // Get the task description from the input field
  const taskDescription = taskInput.value;

  // Create a new task element
  const taskElement = document.createElement('div');
  taskElement.classList.add('task');
  taskElement.innerHTML = `
    <div class="task-content">
      <span class="checkmark">&#10003;</span>
      <p>${taskDescription}</p>
      <span class="timestamp">${new Date().toLocaleString()}</span>
      <span class="remove-task">X</span>
    </div>
  `;

  // Append the task to the task list
  taskList.appendChild(taskElement);

  // Clear the input field
  taskInput.value = '';
}

// Function to toggle task completion
function toggleTaskCompletion(event) {
  const taskElement = event.target.closest('.task');
  if (taskElement) {
    taskElement.classList.toggle('completed');
    const checkmark = taskElement.querySelector('.checkmark');
    showTodoTasks();
  }
}

// Function to remove a task
function removeTask(event) {
  const taskElement = event.target.closest('.task');
  if (taskElement) {
    const confirmRemove = confirm('Are you sure you want to remove this task?');
    if (confirmRemove) {
      taskElement.remove();
    }
  }
}

// Add event listener to the "To-Do Tasks" button
todoTasksBtn.addEventListener('click', () => {
  showTodoTasks();
});

// Add event listener to the "Completed Tasks" button
completedTasksBtn.addEventListener('click', () => {
  showCompletedTasks();
});

// Add event listener to the input field to add a task on "Enter" key press
taskInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addTask();
  }
});

// Add event listener to the task list for toggling task completion
taskList.addEventListener('click', (event) => {
  if (event.target.classList.contains('checkmark')) {
    toggleTaskCompletion(event);
  }
});

// Add event listener to the task list for removing a task
taskList.addEventListener('click', (event) => {
  if (event.target.classList.contains('remove-task')) {
    removeTask(event);
  }
});
