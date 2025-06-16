export {
  setupCreateProjectDialogListeners,
  displayProjectMenu,
  displayCreateProjectView,
  setupAddTaskDialogListeners,
  setupTaskDetailsDialogListeners,
  setupAdjustDueDateDialogListeners,
};
import { Project } from "./classes.js";
import {
  updateProjectInStorage,
  getProjectFromStorage,
  addProjectToStorage,
  getProjectsFromStorage,
  deleteProjectFromStorage,
} from "./storage.js";
import { 
  formatDateTimeDisplay,
  closeDialogOnBGClick,
 } from "./helper.js";

// Query Static DOM Elements
const projectsListMenu = document.querySelector("#projects-list-menu");
const contentCard = document.querySelector("#content-card");
const createProjectDialog = document.querySelector("#create-project-dialog");
const createProjectForm = document.querySelector("#create-project-form");
const projectNameInput = document.querySelector("#project-name");
const projectDueDateInput = document.querySelector("#project-due-date");
const addTaskDialog = document.querySelector("#add-task-dialog");
const addTaskForm = document.querySelector("#add-task-form");
const tasknameInput = document.querySelector("#task-name");
const taskDescriptionInput = document.querySelector("#task-description");
const taskPriorityInput = document.querySelector("#task-priority");
const taskDetailsDialog = document.querySelector("#task-details-dialog");
const taskNameH2 = document.querySelector("#task-name-h2");
const taskPriorityPara = document.querySelector("#task-priority-para");
const taskStatusPara = document.querySelector("#task-status-para");
const taskDescriptionPara = document.querySelector("#task-description-para");
const toggleTaskStatusButton = document.querySelector("#toggle-task-status-button");
const deleteTaskButton = document.querySelector("#delete-task-button");
const adjustDueDateDialog = document.querySelector("#adjust-due-date-dialog");
const adjustDueDateForm = document.querySelector("#adjust-due-date-form");
const adjustDueDateInput = document.querySelector("#adjust-due-date");

function renderTaskDetailsDialog(projectId, taskId) {
  const project = getProjectFromStorage(projectId);
  const task = project.tasks.find(t => t.id === taskId);

  if (!task) return;

  taskNameH2.textContent = task.name;
  taskPriorityPara.textContent = `Priority: ${task.priority}`;
  taskStatusPara.textContent = `Status: ${task.isComplete ? "Complete" : "Active"}`;
  taskDescriptionPara.textContent = `Description: ${task.description || "N/A"}`;

  taskDetailsDialog.dataset.projectId = project.id;
  taskDetailsDialog.dataset.taskId = task.id;

  taskDetailsDialog.showModal();
}

function setupTaskDetailsDialogListeners() {
  if (toggleTaskStatusButton && deleteTaskButton) {
    taskDetailsDialog.addEventListener("click", (event) => {
      if (event.target.closest("#toggle-task-status-button")) {
        console.log("Toggle button clicked");
        // Get relavent project from storage
        const project = getProjectFromStorage(taskDetailsDialog.dataset.projectId);

        // Get relavent task from project
        const taskIndex = project.tasks.findIndex(t => t.id === taskDetailsDialog.dataset.taskId);
        
        console.log("Found project:", project);
        console.log("Task index:", taskIndex);

        if (taskIndex !== -1) {
          // Amend task status in project
          project.tasks[taskIndex].isComplete = !project.tasks[taskIndex].isComplete;

          // Save relavent project back in storage
          updateProjectInStorage(project);

          // Re-render updated dialog
          renderTaskDetailsDialog(taskDetailsDialog.dataset.projectId, taskDetailsDialog.dataset.taskId);
        }
      }
      else if (event.target.closest("#delete-task-button")) {
        // Get relavent project from storage
        const project = getProjectFromStorage(taskDetailsDialog.dataset.projectId);

        // Get relavent task from project
        const taskIndex = project.tasks.findIndex(t => t.id === taskDetailsDialog.dataset.taskId);
        
        if (taskIndex !== -1) {
          // Remove task from project
          project.tasks.splice(taskIndex, 1);

          // Save relavent project back in storage
          updateProjectInStorage(project);

          // Close modal and re-render project details view
          taskDetailsDialog.close();
          displayProjectDetailsView(taskDetailsDialog.dataset.projectId);
        }
      }
    });
  }
  closeDialogOnBGClick(taskDetailsDialog);
}

function setupAdjustDueDateDialogListeners() {
  if (adjustDueDateForm) {
    adjustDueDateForm.addEventListener("submit", (event) => {
      // Prevent page reload
      event.preventDefault();

      // Get new due date
      const newDueDate = adjustDueDateInput.value;

      // Get relavent project from storage based on id
      const project = getProjectFromStorage(adjustDueDateDialog.dataset.projectId);

      // Update due date of project
      project.dueDate = newDueDate;

      // Update project in storage
      updateProjectInStorage(project);

      // Re-render project details view
      displayProjectDetailsView(adjustDueDateDialog.dataset.projectId);

      // Hide the dialog upon form submission
      adjustDueDateDialog.close();
    });
    closeDialogOnBGClick(adjustDueDateDialog);
  }
}

function setupAddTaskDialogListeners() {
  if (addTaskForm) {
    addTaskForm.addEventListener("submit", (event) => {
      event.preventDefault();

      // Add task to relevant project
      const project = getProjectFromStorage(addTaskForm.dataset.projectId);
      project.addTask(
        tasknameInput.value,
        taskDescriptionInput.value,
        taskPriorityInput.value,
      );

      // Save updated project to storage
      updateProjectInStorage(project);

      // Hide the dialog upon submission
      addTaskDialog.close();

      // Display project details with new task
      displayProjectDetailsView(project.id);
    });

  closeDialogOnBGClick(addTaskDialog);
  }
}

function setupCreateProjectDialogListeners() {
  if (createProjectForm) {
    // When form is submitted create project
    createProjectForm.addEventListener("submit", (event) => {
      // Prevent page reload
      event.preventDefault();

      // Create object of class Project
      const newProject = new Project(
        projectNameInput.value,
        projectDueDateInput.value,
      );

      // Add to local storage
      addProjectToStorage(newProject);

      // Hide the dialog upon submission
      createProjectDialog.close();

      // Update menu display with new project
      displayProjectMenu();

      // Display project details of newly created project in content card
      displayProjectDetailsView(newProject.id);
    });
    closeDialogOnBGClick(createProjectDialog);
  }
}

function displayProjectMenu() {
  // Clear out previous display
  projectsListMenu.replaceChildren();

  // Get array of projects from local storage
  const projects = getProjectsFromStorage();

  // Iterate through array, creating dom elements and appending to menu
  for (const project of projects) {
    // Create list element
    const listElement = document.createElement("li");

    // Add name and of project
    listElement.textContent = project.name;
    listElement.dataset.projectId = project.id;

    // Add event listener so menu list elements are clickable
    listElement.addEventListener("click", () => {
      displayProjectDetailsView(listElement.dataset.projectId);
    });

    // Append to menu project list
    projectsListMenu.appendChild(listElement);
  }

  // Add a final list element to create a new project at the bottom of the menu
  const createNewProjectMenuItem = document.createElement("li");
  createNewProjectMenuItem.textContent = "Create New Project +";
  createNewProjectMenuItem.id = "create-project-menu-item";

  // Add event listener to show create project dialog when clicked
  createNewProjectMenuItem.addEventListener("click", () => {
    createProjectDialog.showModal();
  });

  // Add button to bottom of menu
  projectsListMenu.appendChild(createNewProjectMenuItem);
}

function displayProjectDetailsView(projectId) {
  // Clear existing content in content-card
  contentCard.replaceChildren();

  // Get data for selected project
  const project = getProjectFromStorage(projectId);

  // Populate content card with project details
  const detailsContainer = document.createElement("div");
  detailsContainer.className = "project-details";

  // Outer wrapper
  const mainWrapper = document.createElement("div");

  // Project header
  const headerDiv = document.createElement("div");
  const title = document.createElement("h2");
  title.textContent = project.name;

  // Due date
  const dueDateDiv = document.createElement("div");
  dueDateDiv.className = "project-property";

  const dueDateP = document.createElement("p");
  const dueDateStrong = document.createElement("strong");
  dueDateStrong.textContent = "Due Date:";
  dueDateP.appendChild(dueDateStrong);
  dueDateP.appendChild(
    document.createTextNode(
      ` ${formatDateTimeDisplay(project.dueDate) || "N/A"}`,
    ),
  );

  const adjustDueDateBtn = document.createElement("button");
  adjustDueDateBtn.className = "project-details-button";
  adjustDueDateBtn.id = "adjust-due-date-button";
  adjustDueDateBtn.textContent = "Adjust";

  // Add Event Listener to show dialog to adjust
  adjustDueDateBtn.addEventListener("click", () => {
    // Show dialog
    adjustDueDateDialog.showModal();
  });

  dueDateDiv.appendChild(dueDateP);
  dueDateDiv.appendChild(adjustDueDateBtn);

  // Status
  const statusDiv = document.createElement("div");
  statusDiv.className = "project-property";

  const statusP = document.createElement("p");
  const statusStrong = document.createElement("strong");
  statusStrong.textContent = "Status:";
  statusP.appendChild(statusStrong);
  statusP.appendChild(
    document.createTextNode(` ${project.isComplete ? "Complete" : "Active"}`),
  );

  const toggleCompleteBtn = document.createElement("button");
  toggleCompleteBtn.className = "project-details-button";
  toggleCompleteBtn.id = "toggle-complete-button";
  toggleCompleteBtn.textContent = "Toggle";

  // Add Event listener to toggle task completion
  toggleCompleteBtn.addEventListener("click", () => {
    // Get relavent project from storage
    const project = getProjectFromStorage(projectId);

    // Update isComplete
    project.isComplete = !project.isComplete;

    // Return project to storage
    updateProjectInStorage(project);

    // Re-render display
    displayProjectDetailsView(projectId);
  });

  statusDiv.appendChild(statusP);
  statusDiv.appendChild(toggleCompleteBtn);

  // Assemble header
  headerDiv.appendChild(title);
  headerDiv.appendChild(dueDateDiv);
  headerDiv.appendChild(statusDiv);

  // Tasks section
  const tasksWrapper = document.createElement("div");
  const tasksHeading = document.createElement("h3");
  tasksHeading.textContent = "Tasks";

  const tasksList = document.createElement("ul");

  if (project.tasks && project.tasks.length > 0) {
    project.tasks.forEach((task) => {
      // Create List Element for each task
      const li = document.createElement("li");
      const taskNameDiv = document.createElement("div");
      taskNameDiv.textContent = task.name;
      const taskPriorityDiv = document.createElement("div");
      taskPriorityDiv.textContent = `${task.priority} priority`;
      li.appendChild(taskNameDiv);
      li.appendChild(taskPriorityDiv);

      // Add event listener for each task to show dialog of details
      li.addEventListener("click", () => {
        renderTaskDetailsDialog(project.id, task.id);
      });

      tasksList.appendChild(li);
    });
  } else {
    const li = document.createElement("li");
    li.textContent = "No Tasks Yet";
    tasksList.appendChild(li);
  }

  tasksWrapper.appendChild(tasksHeading);
  tasksWrapper.appendChild(tasksList);

  // Add all to mainWrapper
  mainWrapper.appendChild(headerDiv);
  mainWrapper.appendChild(tasksWrapper);

  // Bottom buttons
  const bottomBtnContainer = document.createElement("div");
  bottomBtnContainer.id = "project-details-bottom-buttons-container";

  const addTaskBtn = document.createElement("button");
  addTaskBtn.className = "project-details-button";
  addTaskBtn.id = "add-task-button";
  addTaskBtn.textContent = "Add New Task";

  const deleteProjectBtn = document.createElement("button");
  deleteProjectBtn.className = "project-details-button";
  deleteProjectBtn.id = "delete-project-button";
  deleteProjectBtn.textContent = "Delete Project";

  bottomBtnContainer.appendChild(addTaskBtn);
  bottomBtnContainer.appendChild(deleteProjectBtn);

  // Final assembly
  detailsContainer.appendChild(mainWrapper);
  detailsContainer.appendChild(bottomBtnContainer);
  contentCard.appendChild(detailsContainer);

  // Add Event Listeners for buttons
  if (addTaskBtn) {
    addTaskBtn.addEventListener("click", () => {
      // Set form datavalue for project id
      addTaskForm.dataset.projectId = projectId;

      // Show add task dialog
      addTaskDialog.showModal();
    });
  }

  if (adjustDueDateBtn) {
    adjustDueDateBtn.addEventListener("click", () => {
      // Pass current projectID as data value into form
      adjustDueDateDialog.dataset.projectId = projectId;

      // Show adjust due date form
      adjustDueDateDialog.showModal();
    });
  }

  if (toggleCompleteBtn) {
    toggleCompleteBtn.addEventListener("click", () => {
      // TO DO
    });
  }

  if (deleteProjectBtn) {
    deleteProjectBtn.addEventListener("click", () => {
      if (confirm(`Are you sure you want to delete "${project.name}"?`)) {
        // If confirmed, delete given project from storage
        deleteProjectFromStorage(project.id);

        // Update menu display
        displayProjectMenu();

        // Update content display to add project button instead of deleted content
        displayCreateProjectView();
      }
    });
  }
}

function displayCreateProjectView() {
  // Clear existing content in content-card
  contentCard.replaceChildren();

  // Create variable to store initial html for button view
  const originalButtonHTML = `
        <button id="create-project-button">
            <div id="text">Create New Project</div>
            <svg class="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
        </button>
    `;

  // Reinsert button view
  contentCard.innerHTML = originalButtonHTML;

  // Attach event listeners for big create project button
  const createProjectButton = document.querySelector("#create-project-button");
  if (createProjectDialog) {
    // When create project button is clicked show the dialog
    createProjectButton.addEventListener("click", () => {
      createProjectDialog.showModal();
    });
  }
}