import "./styles.css";
import {
  displayCreateProjectView,
  displayProjectMenu,
  setupCreateProjectDialogListeners,
  setupAddTaskDialogListeners,
  setupTaskDetailsDialogListeners,
  setupAdjustDueDateDialogListeners,
} from "./dom.js";

document.addEventListener("DOMContentLoaded", () => {
  // Attach event listeners for dialog elements
  setupAdjustDueDateDialogListeners();
  setupCreateProjectDialogListeners();
  setupAddTaskDialogListeners();
  setupTaskDetailsDialogListeners();

  // Display the menu with existing projects
  displayProjectMenu();

  // Initially show the create project view
  displayCreateProjectView();
});