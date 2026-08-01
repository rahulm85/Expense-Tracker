// DOM Element Selections
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');

let tasks = [];

// Event Listeners
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});
clearCompletedBtn.addEventListener('click', clearCompleted);

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  const newTask = {
    id: Date.now(),
    text: text,
    completed: false
  };

  tasks.push(newTask);
  taskInput.value = '';
  render();
}

function toggleTask(id) {
  tasks = tasks.map(task => 
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  render();
}

function clearCompleted() {
  tasks = tasks.filter(task => !task.completed);
  render();
}

function render() {
  taskList.innerHTML = '';

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTask(task.id));

    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = task.text;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '&times;';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });

  const remaining = tasks.filter(t => !t.completed).length;
  taskCount.textContent = `${remaining} task${remaining === 1 ? '' : 's'} left`;
}