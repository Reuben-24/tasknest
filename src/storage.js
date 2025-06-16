import { Project, Task } from "./classes.js";
export {
  updateProjectInStorage,
  getProjectFromStorage,
  addProjectToStorage,
  getProjectsFromStorage,
  saveProjectsToStorage,
  deleteProjectFromStorage,
};

// Key for project storage
const PROJECTS_STORAGE_KEY = "myProjects";

function updateProjectInStorage(updatedProject) {
  const projects = getProjectsFromStorage();

  const updatedProjects = projects.map((project) =>
    project.id === updatedProject.id ? updatedProject : project,
  );

  saveProjectsToStorage(updatedProjects);
}

function getProjectFromStorage(projectId) {
  const projects = getProjectsFromStorage();
  const project = projects.find((p) => p.id === projectId);
  if (!project) {
    console.error("Project not found:", projectId);
    return;
  }
  return project;
}

function deleteProjectFromStorage(idToRemove) {
  // Get existing projects as array of objects
  const projects = getProjectsFromStorage();

  // Remove given project from array
  const updatedProjects = projects.filter(
    (project) => project.id !== idToRemove,
  );

  // Save updated array to local storage as JSON string
  saveProjectsToStorage(updatedProjects);
}

function addProjectToStorage(newProject) {
  // Get existing projects as array of objects
  const projects = getProjectsFromStorage();

  // Add this project
  projects.push(newProject);

  // Save updated array to local storage as JSON string
  saveProjectsToStorage(projects);
}

function getProjectsFromStorage() {
  // Get JSON string of projects from local storage
  const projectsJSON = localStorage.getItem(PROJECTS_STORAGE_KEY);

  // If nothing found return empty array
  if (!projectsJSON) return [];

  // Parse the JSON string back into an array of objects
  const projectsData = JSON.parse(projectsJSON);

  // Rehydrate the project and task classes
  const projects = projectsData.map((p) => {
    const project = new Project(p.name, p.dueDate);
    project.id = p.id;
    project.isComplete = p.isComplete;
    project.tasks = p.tasks.map((t) => {
      const task = new Task(t.name, t.description, t.priority);
      task.id = t.id;
      task.isComplete = t.isComplete;
      return task;
    });
    return project;
  });
  return projects;
}

function saveProjectsToStorage(projects) {
  // Convert the array of project objects into a JSON string
  const projectsJSON = JSON.stringify(projects);

  // Store the JSON string in local storage
  localStorage.setItem(PROJECTS_STORAGE_KEY, projectsJSON);
}
