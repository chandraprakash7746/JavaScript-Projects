
const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");
const taskBtn = document.querySelector(".add-task-btn");
const modal = document.querySelector(".modal");
const inputElement = document.querySelector("#input");
const textareaElement = document.querySelector("#text-area");
const addTaskBtn = document.querySelector("#add-task-btn");

const columnsArr = [todo, progress, done];
let dragedElement = null;

// LocalStorage data structure: { todo: [], progress: [], done: [] }
let tasksData = JSON.parse(localStorage.getItem("tasks")) || { todo: [], progress: [], done: [] };


let taskText = "";
let descriptionText = "";

function createTaskElement(title, description, columnId) {
  
  const taskCard = document.createElement("div");
  taskCard.setAttribute("draggable", "true");
  taskCard.classList.add("task");

  taskCard.innerHTML = `
    <h1>${title}</h1>
    <p>${description}</p>
    <button class="dltBtn btn">Delete</button>
  `;

  taskCard.addEventListener("dragstart", () => {
    dragedElement = taskCard;
  });

  
  const dltBtn = taskCard.querySelector(".dltBtn");
  dltBtn.addEventListener("click", () => {
    taskCard.remove();
    updateLocalStorageAndCounts(); 
  });

  
  document.getElementById(columnId).appendChild(taskCard);
}


function updateLocalStorageAndCounts() {
  columnsArr.forEach((col) => {
    const tasksInCol = col.querySelectorAll(".task");
    const countBadge = col.querySelector(".right");

    
    countBadge.innerText = tasksInCol.length;

    // Local storage object mapping
    tasksData[col.id] = Array.from(tasksInCol).map((task) => {
      return {
        title: task.querySelector("h1").innerText,
        disc: task.querySelector("p").innerText,
      };
    });
  });

  localStorage.setItem("tasks", JSON.stringify(tasksData));
}


function loadSavedTasks() {
  Object.keys(tasksData).forEach((columnId) => {
    const savedCards = tasksData[columnId];
    savedCards.forEach((card) => {
      createTaskElement(card.title, card.disc, columnId);
    });
  });
  
  
  columnsArr.forEach((col) => {
    col.querySelector(".right").innerText = col.querySelectorAll(".task").length;
  });
}


function setupColumnDragAndDrop(column) {
  column.addEventListener("dragenter", (e) => {
    column.classList.add("hover-over");
  });

  column.addEventListener("dragleave", (e) => {
    column.classList.remove("hover-over");
  });

  column.addEventListener("dragover", (e) => {
    e.preventDefault(); // Drop event chalne ke liye zaroori hai
  });

  column.addEventListener("drop", (e) => {
    e.preventDefault();
    column.classList.remove("hover-over");

    if (dragedElement) {
      column.appendChild(dragedElement); 
      updateLocalStorageAndCounts();     
    }
  });
}


loadSavedTasks();


columnsArr.forEach(setupColumnDragAndDrop);

taskBtn.addEventListener("click", () => {
  modal.classList.toggle("hide");
});


inputElement.addEventListener("input", (e) => {
  taskText = e.target.value;
});

textareaElement.addEventListener("input", (e) => {
  descriptionText = e.target.value;
});


addTaskBtn.addEventListener("click", () => {
 
  if (taskText.trim().length < 1 || descriptionText.trim().length < 1) {
    alert("Please enter both Task Title and Description");
    return;
  }

  modal.classList.add("hide");

  createTaskElement(taskText, descriptionText, "todo");
  updateLocalStorageAndCounts();

  taskText = "";
  descriptionText = "";
  inputElement.value = "";
  textareaElement.value = "";
});
