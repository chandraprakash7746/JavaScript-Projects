// ==========================================
// 1. DOM SELECTORS
// ==========================================
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

// Temporary states for inputs
let taskText = "";
let descriptionText = "";

// ==========================================
// 2. CORE LOGIC / FUNCTIONS
// ==========================================

// Task elements ko safely DOM mein append aur setup karna
function createTaskElement(title, description, columnId) {
  // Direct card element banaya taaki extra wrapper div ka panga na ho
  const taskCard = document.createElement("div");
  taskCard.setAttribute("draggable", "true");
  taskCard.classList.add("task");

  taskCard.innerHTML = `
    <h1>${title}</h1>
    <p>${description}</p>
    <button class="dltBtn btn">Delete</button>
  `;

  // Drag listeners specifically on this card
  taskCard.addEventListener("dragstart", () => {
    dragedElement = taskCard;
  });

  // Delete Button Logic (Live Event)
  const dltBtn = taskCard.querySelector(".dltBtn");
  dltBtn.addEventListener("click", () => {
    taskCard.remove();
    updateLocalStorageAndCounts(); // Delete hone par count aur storage update karo
  });

  // Target column ke andar append karna
  document.getElementById(columnId).appendChild(taskCard);
}

// LocalStorage ko sync karna aur columns ke header counts update karna
function updateLocalStorageAndCounts() {
  columnsArr.forEach((col) => {
    const tasksInCol = col.querySelectorAll(".task");
    const countBadge = col.querySelector(".right");

    // UI Count number update
    countBadge.innerText = tasksInCol.length;

    // Local storage object mapping
    tasksData[col.id] = Array.from(tasksInCol).map((task) => {
      return {
        title: task.querySelector("h1").innerText,
        disc: task.querySelector("p").innerText, // FIXED: Paragraph tag select kiya description ke liye
      };
    });
  });

  localStorage.setItem("tasks", JSON.stringify(tasksData));
}

// LocalStorage se saved state ko initial window load par screen par banana
function loadSavedTasks() {
  Object.keys(tasksData).forEach((columnId) => {
    const savedCards = tasksData[columnId];
    savedCards.forEach((card) => {
      createTaskElement(card.title, card.disc, columnId);
    });
  });
  
  // Elements create hone ke baad counts display update karo
  columnsArr.forEach((col) => {
    col.querySelector(".right").innerText = col.querySelectorAll(".task").length;
  });
}

// Columns ke dynamic drag/drop features initialize karna
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
      column.appendChild(dragedElement); // Task successfully moved in DOM
      updateLocalStorageAndCounts();     // Save new structural position
    }
  });
}

// ==========================================
// 3. INITIALIZATION & LISTENERS
// ==========================================

// Page refresh ke baad saara data wapas show karne ke liye load function trigger kiya
loadSavedTasks();

// Teeno columns par Drag/Drop mechanism setup kiya
columnsArr.forEach(setupColumnDragAndDrop);

// Modal visibility toggle controller
taskBtn.addEventListener("click", () => {
  modal.classList.toggle("hide");
});

// Live string data indexing (input triggers are better than change)
inputElement.addEventListener("input", (e) => {
  taskText = e.target.value;
});

textareaElement.addEventListener("input", (e) => {
  descriptionText = e.target.value;
});

// Create task inside submission click trigger
addTaskBtn.addEventListener("click", () => {
  // FIXED VALIDATION: Proper spelling and syntax verification rules applied
  if (taskText.trim().length < 1 || descriptionText.trim().length < 1) {
    alert("Please enter both Task Title and Description");
    return;
  }

  modal.classList.add("hide");

  // Default initial container is always 'todo'
  createTaskElement(taskText, descriptionText, "todo");
  updateLocalStorageAndCounts();

  // Inputs reset flow
  taskText = "";
  descriptionText = "";
  inputElement.value = "";
  textareaElement.value = "";
});