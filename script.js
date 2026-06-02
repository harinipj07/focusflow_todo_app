const landingPage = document.getElementById("landingPage");
const loginPage = document.getElementById("loginPage");
const appPage = document.getElementById("appPage");

const getStartedTop = document.getElementById("getStartedTop");
const getStartedMain = document.getElementById("getStartedMain");
const getStartedBottom = document.getElementById("getStartedBottom");

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const password = document.getElementById("password");
const showPassword = document.getElementById("showPassword");
const loginError = document.getElementById("loginError");
const profileEmail = document.getElementById("profileEmail");

const profileBox = document.getElementById("profileBox");
const accountMenu = document.getElementById("accountMenu");
const switchAccountBtn = document.getElementById("switchAccountBtn");
const savedAccounts = document.getElementById("savedAccounts");
const logoutBtn = document.getElementById("logoutBtn");

const taskForm = document.getElementById("taskForm");
const taskTitle = document.getElementById("taskTitle");
const taskDate = document.getElementById("taskDate");
const taskTime = document.getElementById("taskTime");
const taskStatus = document.getElementById("taskStatus");
const taskPriority = document.getElementById("taskPriority");
const submitTaskBtn = document.getElementById("submitTaskBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

const taskDropdownHead = document.getElementById("taskDropdownHead");
const taskDropdownBtn = document.getElementById("taskDropdownBtn");
const activeTaskDropdown = document.getElementById("activeTaskDropdown");
const activeTaskList = document.getElementById("activeTaskList");
const activeProgressText = document.getElementById("activeProgressText");
const activeProgressFill = document.getElementById("activeProgressFill");

const taskNoteInput = document.getElementById("taskNoteInput");
const saveTaskNote = document.getElementById("saveTaskNote");
const selectedTaskLabel = document.getElementById("selectedTaskLabel");
const noteSaved = document.getElementById("noteSaved");

const dateTaskList = document.getElementById("dateTaskList");
const selectedDateText = document.getElementById("selectedDateText");
const dateProgressText = document.getElementById("dateProgressText");
const dateProgressFill = document.getElementById("dateProgressFill");

const showDateTaskForm = document.getElementById("showDateTaskForm");
const dateTaskForm = document.getElementById("dateTaskForm");
const dateTaskTitle = document.getElementById("dateTaskTitle");
const dateTaskTime = document.getElementById("dateTaskTime");
const dateTaskStatus = document.getElementById("dateTaskStatus");
const dateTaskPriority = document.getElementById("dateTaskPriority");

const subtaskOverlay = document.getElementById("subtaskOverlay");
const closeSubtaskModal = document.getElementById("closeSubtaskModal");
const subtaskForm = document.getElementById("subtaskForm");
const subtaskParentLabel = document.getElementById("subtaskParentLabel");
const subtaskTitle = document.getElementById("subtaskTitle");
const subtaskTime = document.getElementById("subtaskTime");
const subtaskStatus = document.getElementById("subtaskStatus");
const subtaskPriority = document.getElementById("subtaskPriority");

const highPriorityList = document.getElementById("highPriorityList");
const moderatePriorityList = document.getElementById("moderatePriorityList");
const lowPriorityList = document.getElementById("lowPriorityList");

const toggleHighPriority = document.getElementById("toggleHighPriority");
const toggleModeratePriority = document.getElementById("toggleModeratePriority");
const toggleLowPriority = document.getElementById("toggleLowPriority");

const calendar = document.getElementById("calendar");
const monthYear = document.getElementById("monthYear");
const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");

let currentUserEmail = "";
let tasks = [];
let selectedDate = formatDate(new Date());
let selectedTaskId = null;
let editingTaskId = null;
let subtaskParentId = null;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

taskDate.value = selectedDate;

/* LANDING TO LOGIN */
getStartedTop.addEventListener("click", showLogin);
getStartedMain.addEventListener("click", showLogin);

if (getStartedBottom) {
    getStartedBottom.addEventListener("click", showLogin);
}

function showLogin() {
    landingPage.classList.add("hidden");
    appPage.classList.add("hidden");
    loginPage.classList.remove("hidden");
}

/* MULTI-USER STORAGE */
function getTaskKey(email) {
    return `notzza_tasks_${email}`;
}

function getTasksForUser(email) {
    return JSON.parse(localStorage.getItem(getTaskKey(email))) || [];
}

function saveTasks() {
    if (!currentUserEmail) return;

    localStorage.setItem(
        getTaskKey(currentUserEmail),
        JSON.stringify(tasks)
    );
}

function loadUserData(email) {
    currentUserEmail = email;
    tasks = getTasksForUser(email);

    normalizeTaskTree(tasks);

    selectedDate = formatDate(new Date());
    selectedTaskId = null;
    editingTaskId = null;
    subtaskParentId = null;

    taskDate.value = selectedDate;
    taskStatus.value = "undone";
    taskPriority.value = "low";

    taskNoteInput.value = "";
    selectedTaskLabel.textContent = "Select a task to write notes.";
}

/* LOGIN */
showPassword.addEventListener("click", () => {
    const hidden = password.type === "password";

    password.type = hidden ? "text" : "password";
    showPassword.textContent = hidden ? "Hide" : "Show";
});

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = emailInput.value.trim().toLowerCase();
    const enteredPassword = password.value.trim();
    const users = JSON.parse(localStorage.getItem("notzza_users")) || {};

    if (!email || !enteredPassword) {
        loginError.textContent = "Please enter email and password.";
        return;
    }

    if (users[email] && users[email] !== enteredPassword) {
        loginError.textContent = "Wrong password for this email.";
        password.value = "";
        password.focus();
        return;
    }

    if (!users[email]) {
        users[email] = enteredPassword;
        localStorage.setItem("notzza_users", JSON.stringify(users));
    }

    loginError.textContent = "";
    showApp(email);
});

function showApp(email) {
    loadUserData(email);

    profileEmail.textContent = email;

    landingPage.classList.add("hidden");
    loginPage.classList.add("hidden");
    appPage.classList.remove("hidden");

    renderAll();
}

/* ACCOUNT MENU */
profileBox.addEventListener("click", () => {
    accountMenu.classList.toggle("hidden");
    savedAccounts.classList.add("hidden");
});

switchAccountBtn.addEventListener("click", () => {
    savedAccounts.classList.toggle("hidden");
    renderSavedAccounts();
});

logoutBtn.addEventListener("click", () => {
    accountMenu.classList.add("hidden");
    savedAccounts.classList.add("hidden");

    currentUserEmail = "";
    tasks = [];
    selectedTaskId = null;
    editingTaskId = null;
    subtaskParentId = null;

    appPage.classList.add("hidden");
    landingPage.classList.add("hidden");
    loginPage.classList.remove("hidden");

    emailInput.value = "";
    password.value = "";
    loginError.textContent = "";
});

function renderSavedAccounts() {
    const users = JSON.parse(localStorage.getItem("notzza_users")) || {};
    const accounts = Object.keys(users);

    savedAccounts.innerHTML = "";

    if (accounts.length === 0) {
        const empty = document.createElement("button");
        empty.textContent = "No saved accounts";
        empty.type = "button";
        savedAccounts.appendChild(empty);
        return;
    }

    accounts.forEach((email) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = email;

        btn.addEventListener("click", () => {
            accountMenu.classList.add("hidden");
            savedAccounts.classList.add("hidden");
            showApp(email);
        });

        savedAccounts.appendChild(btn);
    });
}

document.addEventListener("click", (event) => {
    if (!event.target.closest(".profile-wrapper")) {
        accountMenu.classList.add("hidden");
        savedAccounts.classList.add("hidden");
    }
});

/* ACTIVE TASK DROPDOWN */
taskDropdownHead.addEventListener("click", () => {
    activeTaskDropdown.classList.toggle("open");

    taskDropdownBtn.textContent =
        activeTaskDropdown.classList.contains("open") ?
        "⌃" :
        "⌄";

    renderActiveTasks();
});

/* PRIORITY DROPDOWNS */
toggleHighPriority.addEventListener("click", () => {
    togglePriorityList(highPriorityList, toggleHighPriority);
});

toggleModeratePriority.addEventListener("click", () => {
    togglePriorityList(moderatePriorityList, toggleModeratePriority);
});

toggleLowPriority.addEventListener("click", () => {
    togglePriorityList(lowPriorityList, toggleLowPriority);
});

function togglePriorityList(list, button) {
    list.classList.toggle("collapsed");

    button.textContent = list.classList.contains("collapsed") ?
        "⌄" :
        "⌃";
}

/* MAIN TASK FORM */
taskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = taskTitle.value.trim();
    if (!title) return;

    if (editingTaskId) {
        const task = findTaskById(editingTaskId);

        if (task) {
            task.title = title;
            task.date = taskDate.value;
            task.time = taskTime.value;
            task.status = taskStatus.value;
            task.priority = taskPriority.value;
        }

        editingTaskId = null;
        submitTaskBtn.textContent = "Add Task";
        cancelEditBtn.classList.add("hidden");
    } else {
        tasks.push({
            id: Date.now(),
            title,
            date: taskDate.value,
            time: taskTime.value,
            status: taskStatus.value,
            priority: taskPriority.value,
            note: "",
            subtasks: []
        });
    }

    selectedDate = taskDate.value;

    taskForm.reset();
    taskDate.value = selectedDate;
    taskStatus.value = "undone";
    taskPriority.value = "low";

    saveTasks();
    renderAll();
});

cancelEditBtn.addEventListener("click", () => {
    editingTaskId = null;

    taskForm.reset();
    taskDate.value = selectedDate;
    taskStatus.value = "undone";
    taskPriority.value = "low";

    submitTaskBtn.textContent = "Add Task";
    cancelEditBtn.classList.add("hidden");
});

/* DATE TASK FORM */
showDateTaskForm.addEventListener("click", () => {
    dateTaskForm.classList.toggle("hidden");

    showDateTaskForm.textContent =
        dateTaskForm.classList.contains("hidden") ?
        "+" :
        "×";

    if (!dateTaskForm.classList.contains("hidden")) {
        dateTaskTitle.focus();
    }
});

dateTaskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = dateTaskTitle.value.trim();
    if (!title) return;

    tasks.push({
        id: Date.now(),
        title,
        date: selectedDate,
        time: dateTaskTime.value,
        status: dateTaskStatus.value,
        priority: dateTaskPriority.value,
        note: "",
        subtasks: []
    });

    dateTaskForm.reset();
    dateTaskStatus.value = "undone";
    dateTaskPriority.value = "low";

    dateTaskForm.classList.add("hidden");
    showDateTaskForm.textContent = "+";

    saveTasks();
    renderAll();
});

/* SUBTASK MODAL */
function openSubtaskModal(parentId) {
    const parentTask = findTaskById(parentId);
    if (!parentTask) return;

    subtaskParentId = parentId;
    subtaskParentLabel.textContent = `Under: ${parentTask.title}`;

    subtaskTitle.value = "";
    subtaskTime.value = "";
    subtaskStatus.value = "undone";
    subtaskPriority.value = parentTask.priority || "low";

    subtaskOverlay.classList.remove("hidden");
    subtaskTitle.focus();
}

function closeSubtaskBox() {
    subtaskOverlay.classList.add("hidden");
    subtaskParentId = null;

    subtaskForm.reset();
    subtaskStatus.value = "undone";
    subtaskPriority.value = "low";
}

closeSubtaskModal.addEventListener("click", closeSubtaskBox);

subtaskOverlay.addEventListener("click", (event) => {
    if (event.target === subtaskOverlay) {
        closeSubtaskBox();
    }
});

subtaskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = subtaskTitle.value.trim();
    if (!title || !subtaskParentId) return;

    const parentTask = findTaskById(subtaskParentId);
    if (!parentTask) return;

    if (!Array.isArray(parentTask.subtasks)) {
        parentTask.subtasks = [];
    }

    parentTask.subtasks.push({
        id: Date.now(),
        title,
        date: parentTask.date,
        time: subtaskTime.value,
        status: subtaskStatus.value,
        priority: subtaskPriority.value,
        note: "",
        subtasks: []
    });

    saveTasks();
    closeSubtaskBox();
    renderAll();
});

/* NOTES */
saveTaskNote.addEventListener("click", () => {
    if (!selectedTaskId) {
        noteSaved.textContent = "Select a task first.";
        return;
    }

    const task = findTaskById(selectedTaskId);

    if (task) {
        task.note = taskNoteInput.value;
        saveTasks();

        noteSaved.textContent = "Note saved.";

        setTimeout(() => {
            noteSaved.textContent = "";
        }, 1500);
    }
});

/* CALENDAR CONTROLS */
prevMonth.addEventListener("click", () => {
    currentMonth--;

    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }

    renderCalendar();
});

nextMonth.addEventListener("click", () => {
    currentMonth++;

    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }

    renderCalendar();
});

/* TASK TREE HELPERS */
function normalizeTaskTree(taskList) {
    taskList.forEach((task) => {
        if (!Array.isArray(task.subtasks)) {
            task.subtasks = [];
        }

        if (!task.priority) {
            task.priority = "low";
        }

        normalizeTaskTree(task.subtasks);
    });
}

function findTaskById(id, list = tasks) {
    for (const task of list) {
        if (task.id === id) return task;

        if (task.subtasks && task.subtasks.length > 0) {
            const found = findTaskById(id, task.subtasks);
            if (found) return found;
        }
    }

    return null;
}

function deleteTaskById(id, list = tasks) {
    const index = list.findIndex((task) => task.id === id);

    if (index !== -1) {
        list.splice(index, 1);
        return true;
    }

    for (const task of list) {
        if (task.subtasks && deleteTaskById(id, task.subtasks)) {
            return true;
        }
    }

    return false;
}

function flattenTasks(list = tasks) {
    let result = [];

    list.forEach((task) => {
        result.push(task);

        if (task.subtasks && task.subtasks.length > 0) {
            result = result.concat(flattenTasks(task.subtasks));
        }
    });

    return result;
}

function getTaskDateGroup(date) {
    return flattenTasks(tasks).filter((task) => task.date === date);
}

/* DATE FUNCTIONS */
function formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");

    return `${y}-${m}-${d}`;
}

function readableDate(dateString) {
    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

function getProgress(list) {
    const total = list.length;
    const completed =
        list.filter((task) => task.status === "completed").length;

    const percent =
        total === 0 ? 0 : Math.round((completed / total) * 100);

    return {
        total,
        completed,
        percent
    };
}

/* RENDER ACTIVE TASKS */
function renderActiveTasks() {
    normalizeTaskTree(tasks);

    const activeTasks =
        tasks.filter((task) => task.status !== "completed");

    activeTaskList.innerHTML = "";

    const previewCount = 3;
    const isOpen = activeTaskDropdown.classList.contains("open");

    const visibleTasks =
        isOpen ? activeTasks : activeTasks.slice(0, previewCount);

    if (activeTasks.length === 0) {
        activeTaskList.innerHTML =
            `<li class="task-item"><p class="task-title">No active tasks.</p></li>`;
    }

    visibleTasks.forEach((task) => {
        activeTaskList.appendChild(
            createTaskItem(task, true, 0)
        );
    });

    if (!isOpen && activeTasks.length > previewCount) {
        const more = document.createElement("li");
        more.className = "more-task-hint";
        more.textContent =
            `+${activeTasks.length - previewCount} more tasks. Click dropdown to view all.`;

        activeTaskList.appendChild(more);
    }

    const progress = getProgress(flattenTasks(tasks));

    activeProgressText.textContent =
        `${progress.completed}/${progress.total}`;

    activeProgressFill.style.width =
        `${progress.percent}%`;
}

/* RENDER DATE TASKS */
function renderDateTasks() {
    normalizeTaskTree(tasks);

    const dateTasks =
        tasks.filter((task) => task.date === selectedDate);

    selectedDateText.textContent = readableDate(selectedDate);
    dateTaskList.innerHTML = "";

    if (dateTasks.length === 0) {
        dateTaskList.innerHTML =
            `<li class="task-item"><p class="task-title">No tasks for this date.</p></li>`;
    }

    dateTasks.forEach((task) => {
        dateTaskList.appendChild(
            createTaskItem(task, false, 0)
        );
    });

    const progress = getProgress(getTaskDateGroup(selectedDate));

    dateProgressText.textContent =
        `${progress.completed}/${progress.total}`;

    dateProgressFill.style.width =
        `${progress.percent}%`;
}

/* CREATE TASK ITEM */
function createTaskItem(task, canSelectNote, level = 0) {
    const wrapper = document.createElement("li");
    wrapper.className = `task-tree-item level-${level}`;

    const item = document.createElement("div");
    item.className =
        `task-item ${task.status} ${selectedTaskId === task.id ? "selected" : ""}`;

    const label = {
        undone: "Undone",
        progress: "In Progress",
        completed: "Completed"
    }[task.status];

    const priority = task.priority || "low";

    item.innerHTML = `
    <div>
      <p class="task-title">${task.title}</p>
      <p class="task-meta">
        ${readableDate(task.date)}
        ${task.time ? "· " + task.time : ""}
        · ${label}
        · <span class="priority-badge ${priority}">${capitalize(priority)}</span>
      </p>
    </div>

    <div class="status-row">
      <span class="status-dot"></span>

      <select class="status-select">
        <option value="undone" ${task.status === "undone" ? "selected" : ""}>Undone</option>
        <option value="progress" ${task.status === "progress" ? "selected" : ""}>In Progress</option>
        <option value="completed" ${task.status === "completed" ? "selected" : ""}>Completed</option>
      </select>

      <select class="priority-select">
        <option value="low" ${priority === "low" ? "selected" : ""}>Low</option>
        <option value="moderate" ${priority === "moderate" ? "selected" : ""}>Moderate</option>
        <option value="high" ${priority === "high" ? "selected" : ""}>High</option>
      </select>

      <button class="add-subtask-btn" title="Add subtask">+</button>
      <button class="edit-task" title="Edit task">✎</button>
      <button class="delete-task" title="Delete task">×</button>
    </div>
  `;

    if (canSelectNote) {
        item.addEventListener("click", (event) => {
            if (
                event.target.tagName === "SELECT" ||
                event.target.tagName === "BUTTON"
            ) {
                return;
            }

            selectTask(task.id);
        });
    }

    item.querySelector(".status-select").addEventListener("change", (event) => {
        task.status = event.target.value;
        saveTasks();
        renderAll();
    });

    item.querySelector(".priority-select").addEventListener("change", (event) => {
        task.priority = event.target.value;
        saveTasks();
        renderAll();
    });

    item.querySelector(".add-subtask-btn").addEventListener("click", () => {
        openSubtaskModal(task.id);
    });

    item.querySelector(".edit-task").addEventListener("click", () => {
        editingTaskId = task.id;

        taskTitle.value = task.title;
        taskDate.value = task.date;
        taskTime.value = task.time;
        taskStatus.value = task.status;
        taskPriority.value = task.priority || "low";

        submitTaskBtn.textContent = "Update Task";
        cancelEditBtn.classList.remove("hidden");

        document.querySelector("#planner").scrollIntoView({
            behavior: "smooth"
        });
    });

    item.querySelector(".delete-task").addEventListener("click", () => {
        deleteTaskById(task.id);

        if (selectedTaskId === task.id) {
            selectedTaskId = null;
            taskNoteInput.value = "";
            selectedTaskLabel.textContent =
                "Select a task to write notes.";
        }

        saveTasks();
        renderAll();
    });

    wrapper.appendChild(item);

    if (task.subtasks && task.subtasks.length > 0) {
        const subList = document.createElement("ul");
        subList.className = "subtask-list";

        task.subtasks.forEach((subtask) => {
            subList.appendChild(
                createTaskItem(subtask, canSelectNote, level + 1)
            );
        });

        wrapper.appendChild(subList);
    }

    return wrapper;
}

function selectTask(id) {
    selectedTaskId = id;
    const task = findTaskById(id);

    if (task) {
        selectedTaskLabel.textContent = `Notes for: ${task.title}`;
        taskNoteInput.value = task.note || "";
    }

    renderActiveTasks();
}

/* PRIORITY LIST */
function renderPriorityLists() {
    const allTasks = flattenTasks(tasks);

    renderPriorityGroup(
        "high",
        highPriorityList,
        allTasks.filter((task) => task.priority === "high")
    );

    renderPriorityGroup(
        "moderate",
        moderatePriorityList,
        allTasks.filter((task) => task.priority === "moderate")
    );

    renderPriorityGroup(
        "low",
        lowPriorityList,
        allTasks.filter((task) => !task.priority || task.priority === "low")
    );
}

function renderPriorityGroup(priority, container, list) {
    container.innerHTML = "";

    if (list.length === 0) {
        container.innerHTML =
            `<li class="priority-task"><strong>No ${priority} priority tasks.</strong></li>`;
        return;
    }

    list.forEach((task) => {
        const li = document.createElement("li");
        li.className = `priority-task priority-${priority}`;

        li.innerHTML = `
      <div>
        <strong>${task.title}</strong>
        <span>${readableDate(task.date)} ${task.time ? "· " + task.time : ""}</span>
      </div>
      <span class="priority-badge ${priority}">${capitalize(priority)}</span>
    `;

        container.appendChild(li);
    });
}

/* CALENDAR */
function renderCalendar() {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    monthYear.textContent =
        `${months[currentMonth]} ${currentYear}`;

    calendar.innerHTML = "";

    const firstDay =
        new Date(currentYear, currentMonth, 1).getDay();

    const totalDays =
        new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement("div");
        empty.className = "empty-day";
        calendar.appendChild(empty);
    }

    for (let day = 1; day <= totalDays; day++) {
        const date =
            `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        const dateTasks = getTaskDateGroup(date);

        const box = document.createElement("div");
        box.className =
            `day ${date === selectedDate ? "selected" : ""}`;

        const dots = dateTasks.slice(0, 4).map((task) => {
            const color =
                task.status === "completed" ?
                "var(--done)" :
                task.status === "progress" ?
                "var(--progress)" :
                "var(--warning)";

            return `<span class="day-dot" style="background:${color}"></span>`;
        }).join("");

        const progress = getProgress(dateTasks);

        box.innerHTML = `
      <div class="day-number">${day}</div>
      <div class="day-dots">${dots}</div>
      <div class="day-progress-small">${progress.completed}/${progress.total} done</div>
    `;

        box.addEventListener("click", () => {
            selectedDate = date;

            dateTaskForm.classList.add("hidden");
            showDateTaskForm.textContent = "+";

            renderAll();
        });

        calendar.appendChild(box);
    }
}

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function renderAll() {
    renderActiveTasks();
    renderDateTasks();
    renderCalendar();
    renderPriorityLists();
}