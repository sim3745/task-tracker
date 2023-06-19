// Get references to the task list, buttons, and input field
const taskList = document.querySelector('.task-list');
const todoTasksBtn = document.querySelector('.task-buttons button:nth-child(1)');
const completedTasksBtn = document.querySelector('.task-buttons button:nth-child(2)');
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.querySelector('.add-task-btn');
const clearTasksBtn = document.querySelector('.clear-tasks');

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

  // Check if the input field is empty
  if (taskDescription.trim() === '') {
    return; // Exit the function if the input field is empty
  }

  // Create a new task element
  const taskElement = document.createElement('div');
  taskElement.classList.add('task');
  taskElement.innerHTML = `
    <div class="task-content">
      <button class="toggle-completion task-btn checkmark">&#10003;</button>
      <p class="task-description">${taskDescription}</p>
      <span class="timestamp"><p>${new Date().toLocaleString()}</p></span>
      <button class="remove-task task-btn">X</button>
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

    const checkmarkButton = taskElement.querySelector('.toggle-completion');
    if (checkmarkButton) {
      checkmarkButton.remove();
    }

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

// Function to clear all tasks
function clearTasks() {
  taskList.innerHTML = '';
  localStorage.removeItem('tasks');
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
    event.preventDefault(); // Prevent the default "Enter" key behavior

    // Get the task description from the input field
    const taskDescription = taskInput.value;

    // Check if the input field is empty
    if (taskDescription.trim() !== '') {
      addTask();
    }
  }
});

// Add event listener to the "Add New Task" button
addTaskBtn.addEventListener('click', () => {
  // Get the task description from the input field
  const taskDescription = taskInput.value;

  // Check if the input field is empty
  if (taskDescription.trim() !== '') {
    addTask();
  }
});

// Add event listener to the "Clear Tasks" button
clearTasksBtn.addEventListener('click', () => {
  clearTasks();
});

// Load tasks from local storage on page load
window.addEventListener('load', () => {
  const tasks = JSON.parse(localStorage.getItem('tasks'));
  if (tasks) {
    tasks.forEach(task => {
      const taskElement = createTaskElement(task);
      taskList.appendChild(taskElement);
    });

    // Show only the To-Do tasks on page load
    showTodoTasks();
  }
});

// Function to create a task element
function createTaskElement(task) {
  const taskElement = document.createElement('div');
  taskElement.classList.add('task');
  taskElement.classList.toggle('completed', task.completed);

  const taskContent = document.createElement('div');
  taskContent.classList.add('task-content');

  if (!task.completed) {
    const toggleButton = document.createElement('span');
    toggleButton.classList.add('toggle-completion');
    toggleButton.innerHTML = '<button class="toggle-completion task-btn checkmark">&#10003;</button>';
    taskContent.appendChild(toggleButton);
  }

  const taskDescription = document.createElement('p');
  taskDescription.classList.add('task-description');
  taskDescription.textContent = task.description;
  taskContent.appendChild(taskDescription);

  const editButton = document.createElement('span');
  editButton.classList.add('edit-task');
  editButton.innerHTML = '<img src="./imgs/edit-icon.png" alt="Edit">';
  taskContent.appendChild(editButton);

  const timestamp = document.createElement('span');
  timestamp.classList.add('timestamp');
  timestamp.textContent = task.timestamp;
  taskContent.appendChild(timestamp);

  const removeButton = document.createElement('span');
  removeButton.classList.add('remove-task');
  removeButton.innerHTML = '<button class="remove-task task-btn">X</button>';
  taskContent.appendChild(removeButton);

  taskElement.appendChild(taskContent);

  // Add event listener to the edit button
  editButton.addEventListener('click', () => {
    editTask(taskElement, task);
  });

  return taskElement;
}

// Function to handle task editing
function editTask(taskElement, task) {
  const taskDescription = taskElement.querySelector('.task-description');
  const previousDescription = taskDescription.textContent;

  // Create an input field with the previous task description
  const inputField = document.createElement('input');
  inputField.type = 'text';
  inputField.value = previousDescription;

  // Replace the task description with the input field
  taskDescription.replaceWith(inputField);

  // Focus on the input field
  inputField.focus();

  // Event listener for handling the input field on blur (lose focus)
  inputField.addEventListener('blur', () => {
    const newDescription = inputField.value;

    // Update the task description if it has changed
    if (newDescription !== previousDescription) {
      taskDescription.textContent = newDescription;
      task.description = newDescription;

      // Update task description in local storage
      updateTaskDescription(taskElement, task);
    }

    // Replace the input field with the task description
    inputField.replaceWith(taskDescription);
  });

  // Event listener for handling the input field on Enter key press
  inputField.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the default Enter key behavior
      inputField.blur(); // Trigger the blur event to update the task description
    }
  });
}

// Function to update task description in local storage
function updateTaskDescription(taskElement, task) {
  const tasks = JSON.parse(localStorage.getItem('tasks'));
  const index = Array.from(taskList.children).indexOf(taskElement);
  tasks[index].description = task.description;
  localStorage.setItem('tasks', JSON.stringify(tasks));
}




// Add event listener to the task list for toggling task completion
taskList.addEventListener('click', (event) => {
  if (event.target.classList.contains('toggle-completion') || event.target.classList.contains('checkmark')) {
    toggleTaskCompletion(event);
  }
});

// Add event listener to the task list for removing a task
taskList.addEventListener('click', (event) => {
  if (event.target.classList.contains('remove-task')) {
    removeTask(event);
  }
});
