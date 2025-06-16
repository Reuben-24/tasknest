export { Project, Task };

class Project {
  constructor(name, dueDate) {
    this.id = Date.now().toString();
    this.name = name;
    this.dueDate = dueDate;
    this.isComplete = false;
    this.tasks = [];
  }

  addTask(name, description, priority) {
    // Construct new task
    const newTask = new Task(name, description, priority);

    // Add new task to tasks property
    this.tasks.push(newTask);
  }
}

class Task {
  constructor(name, description, priority) {
    this.id = Date.now().toString();
    this.name = name;
    this.description = description;
    this.priority = priority;
    this.isComplete = false;
  }
}
