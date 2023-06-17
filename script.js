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

  // Save the task to local storage
  saveTask(taskDescription);

  // Clear the input field
  taskInput.value = '';
}

// Function to save the task to local storage
function saveTask(taskDescription) {
  let tasks = [];

  if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }

  const task = {
    description: taskDescription,
    timestamp: new Date().toLocaleString(),
    completed: false
  };

  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to toggle task completion
function toggleTaskCompletion(event) {
  const taskElement = event.target.closest('.task');
  if (taskElement) {
    taskElement.classList.toggle('completed');
    const checkmark = taskElement.querySelector('.checkmark');

    // Update task completion status in local storage
    updateTaskCompletion(taskElement);
    showTodoTasks();
  }
}

// Function to update task completion status in local storage
function updateTaskCompletion(taskElement) {
  const tasks = JSON.parse(localStorage.getItem('tasks'));
  const index = Array.from(taskList.children).indexOf(taskElement);
  tasks[index].completed = taskElement.classList.contains('completed');
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to remove a task
function removeTask(event) {
  const taskElement = event.target.closest('.task');
  if (taskElement) {
    const confirmRemove = confirm('Are you sure you want to remove this task?');
    if (confirmRemove) {
      taskElement.remove();

      // Remove task from local storage
      removeTaskFromStorage(taskElement);
    }
  }
}

// Function to remove task from local storage
function removeTaskFromStorage(taskElement) {
  const tasks = JSON.parse(localStorage.getItem('tasks'));
  const index = Array.from(taskList.children).indexOf(taskElement);
  tasks.splice(index, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));
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

// Load tasks from local storage on page load
window.addEventListener('load', () => {
  const tasks = JSON.parse(localStorage.getItem('tasks'));
  if (tasks) {
    tasks.forEach(task => {
      const taskElement = createTaskElement(task);
      taskList.appendChild(taskElement);
    });
  }
});

// Function to create a task element
function createTaskElement(task) {
  const taskElement = document.createElement('div');
  taskElement.classList.add('task');
  taskElement.classList.toggle('completed', task.completed);
  taskElement.innerHTML = `
    <div class="task-content">
      <span class="checkmark">&#10003;</span>
      <p>${task.description}</p>
      <span class="timestamp">${task.timestamp}</span>
      <span class="remove-task">X</span>
    </div>
  `;

  return taskElement;
}

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
