// VALIDATION

const form = document.getElementById("todoForm");

form.addEventListener("submit", function (event) {
  event.preventDefault();
  if (isValidate()) {
    addTask(event);
  }
});

function isValidate() {
  const title = form.elements.title.value;
  const desc = form.elements.description.value;

  const titleInput = document.getElementById("title");
  const titleError = document.getElementById("title-error");

  const descInput = document.getElementById("description");
  const descError = document.getElementById("desc-error");

  let valid = true;

  const titleRegex = /^[a-zA-Z0-9\s]{2,40}$/;

  if (title.trim() === "") {
    titleError.innerHTML = "Please Enter A Title";
    titleInput.style.borderColor = "red";
    titleInput.style.boxShadow = "0 0 5px red";

    valid = false;
  } else if (!title.match(titleRegex)) {
    titleError.innerHTML =
      "Title Must be between 2 and 20 characters and allows only alphanumeric characters";
    titleInput.style.borderColor = "red";
    titleInput.style.boxShadow = "0 0 5px red";

    valid = false;
  } else {
    titleError.innerHTML = "";
    titleInput.style.borderColor = "black";
    titleInput.style.boxShadow = "none";
  }

  if (desc.trim() === "") {
    descError.innerHTML = "Description Can Not be Empty";
    descInput.style.borderColor = "red";
    descInput.style.boxShadow = "0 0 5px red";

    valid = false;
  } else {
    descError.innerHTML = "";
    descInput.style.borderColor = "black";
    descInput.style.boxShadow = "none";
  }

  return valid;
}

// Add New Task 

// Function to add a task and handle button text
function addTask(event) {
  event.preventDefault();
  const form = document.getElementById("todoForm");
  const title = form.elements.title.value;
  const description = form.elements.description.value;
  const status = form.elements.status.value;

  // Check if the form is valid
  if (isValidate()) {
    tasks.push({ title, description, status });
    displayTasks();
    saveTasksToStorage();
    form.reset();
    statusContainer.style.display = "none";

    // Check if the form is submitted and change the button text accordingly
      // Set the text content of the submit button back to "Add Task"
      document.getElementById("submitForm").textContent = "Add Task";
    
  }
}

// Store the default text content of the submit button
const defaultSubmitBtnText = "Add Task";

// Function to reset the submit button text content to its default value
function resetSubmitBtnText() {
  const submitBtn = document.getElementById("submitForm");
  submitBtn.textContent = defaultSubmitBtnText;

  // Clear Input fields

  const titleInput = document.getElementById("title");
    const descInput = document.getElementById("description");
    const titleError = document.getElementById("title-error");
    const descError = document.getElementById("desc-error");
  
    // Reset error messages and styles
    titleError.innerHTML = "";
    titleInput.style.borderColor = "black";
    titleInput.style.boxShadow = "none";
    descError.innerHTML = "";
    descInput.style.borderColor = "black";
    descInput.style.boxShadow = "none";
  
    // Hide status container
    statusContainer.style.display = "none";
  
    // displayTasks();
  
}

// Add a click event listener to the clear button to reset the submit button text content
document.getElementById("resetForm").addEventListener("click", resetSubmitBtnText);


// Create status array 

const statuses = ["BackLog", "In Progress", "Review", "Completed"];

// Function to create status containers dynamically
function createStatusContainers() {
  const taskList = document.querySelector("#TaskList");

  statuses.forEach((status) => {
    const statusContainer = document.createElement("div");
    statusContainer.id = `${status.toLowerCase()}Tasks`;
    statusContainer.className = "status-container";
    statusContainer.innerHTML = `<h4>${status}</h4>`;
    taskList.appendChild(statusContainer);
  });
}

// create status field

function createStatusField() {
  const statusContainer = document.getElementById("statusContainer");
  statusContainer.style.display = "none";

  const label = document.createElement("label");
  label.setAttribute("for", "status");
  label.textContent = "Status:";

  const selectStatus = document.createElement("select");
  selectStatus.setAttribute("id", "status");
  selectStatus.setAttribute("name", "status");

  statuses.forEach((status) => {
    const option = document.createElement("option");

    option.label = status;
    option.value = status;
    option.textContent = status;
    selectStatus.appendChild(option);
  });

  statusContainer.appendChild(label);
  statusContainer.appendChild(selectStatus);

}

createStatusField();

// DISPLAY TASK
function displayTasks() {
  // Clear existing task list
  const taskList = document.querySelector("#TaskList");
  taskList.innerHTML = "";

  // Create status containers
  createStatusContainers();

  tasks.forEach((task) => {
    const statusContainer = document.getElementById(
      `${task.status.toLowerCase()}Tasks`
    );

    const taskElement = document.createElement("div");
    taskElement.innerHTML = `
        <div id="container-edit" draggable = "true">
          <div id="flex">
            <h5 class="task-title" id="titles">${task.title}</h5>
            <div id="j-flex">
              <a href="#" id="edit-button" onclick="editTask('${task.title}' , event)">Edit</a>
              <a href="#" id="delete-button" onclick="deleteTask('${task.title}' , event)">Delete</a>
            </div>
          </div>
          <p class="task-description" id="descriptions">${task.description}</p>
        </div>
      `;
    statusContainer.appendChild(taskElement);
  });

// Handel drag and drop functionality
  // taskList.addEventListener("click", function(event) {
  //   if (event.target.classList.contains("edit-button")) {
  //     const title = event.target.closest(".task-container").querySelector(".task-title").textContent;
  //     editTask(title, event);
  //   }
  // });

  // Add Logic of dropdown tasks

  const taskContainers = document.querySelectorAll(".task-container");

  taskContainers.forEach((task) => {
  task.addEventListener("dragstart", handleDragStart);
  task.addEventListener("dragend", handleDragEnd);
});

const statusContainers = document.querySelectorAll(".status-container");

statusContainers.forEach((container) => {
  container.addEventListener("dragover", handleDragOver);
  container.addEventListener("drop", handleDrop);
});
}

let draggedTask = null;

function handleDragStart(event) {
  draggedTask = event.target;
  event.target.style.opacity = "0.5";
}

function handleDragEnd(event) {
  event.target.style.opacity = "1";
}

function handleDragOver(event) {
  event.preventDefault();
}

function handleDrop(event) {
  event.preventDefault();
  const targetContainer = event.target.closest(".status-container");
  if (targetContainer && draggedTask) {
    const newStatus = targetContainer.id.replace("Tasks", "");
    const taskTitle = draggedTask.querySelector(".task-title").textContent;
    const taskIndex = tasks.findIndex(task => task.title === taskTitle);
    if (taskIndex !== -1) {
      tasks[taskIndex].status = newStatus;
      saveTasksToStorage();
    }
    targetContainer.appendChild(draggedTask);
    draggedTask = null;
  }
}

// edit  a Task
function editTask(title, event) {
  event.preventDefault();
  const index = tasks.findIndex((task) => task.title === title);
  if (index !== -1) {
    const task = tasks[index];
    const form = document.getElementById("todoForm");
    form.elements.title.value = task.title;
    form.elements.description.value = task.description;

    const statusDropdown = form.elements.status;
    const selectedStatus = task.status.toLowerCase();

   statusDropdown.querySelectorAll('option').forEach((option, index) => {
     if (option.value.toLowerCase() === selectedStatus) {
     statusDropdown.selectedIndex = index;
     return;
  }
  });
  
    const submitBtn = document.getElementById('submitForm');
    submitBtn.textContent = "Save Task";

    const statusContainer = document.getElementById("statusContainer");
    statusContainer.style.display = "block";

    tasks.splice(index, 1);
  }
}


// Function to delete a task
function deleteTask(title , event) {
  event.preventDefault();
  tasks = tasks.filter((task) => task.title !== title);
  displayTasks();
  saveTasksToStorage();
}

// save tasks to local storage
function saveTasksToStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// get tasks from local storage
function getTaskFromStorage() {
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
    displayTasks();
  }
}

// Search Function

function findTask() {
  let input = document.getElementById("searchInput").value.trim().toLowerCase();
  let allTasks = document.querySelectorAll(".status-container div");

  allTasks.forEach(function (taskElement) {
    let taskTitleElement = taskElement.querySelector(".task-title");
    let taskDescriptionElement = taskElement.querySelector(".task-description");

    if (!taskTitleElement || !taskDescriptionElement) {
      return; // Skip if title or description element not found
    }

    let taskTitle = taskTitleElement.textContent.toLowerCase();
    let taskDescription = taskDescriptionElement.textContent.toLowerCase();

    // Check if the title or description contains the search input
    if (taskTitle.includes(input) || taskDescription.includes(input)) {
      taskElement.style.display = "block"; // Show the task element
    } else {
      taskElement.style.display = "none"; // Hide the task element
    }
  });
}


// Clear search

function clearSearch() {
  document.getElementById("searchInput").value = "";
  displayTasks();
}

// create Array for store and process

let tasks = [];
getTaskFromStorage();
