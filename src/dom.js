const createProjectDialog = document.querySelector("#create-project-dialog");
const createProjectButton = document.querySelector("#create-project-button");

if (createProjectButton) {
    createProjectButton.addEventListener("click", () => {
        createProjectDialog.showModal();
    });
}

if (createProjectDialog) {
    createProjectDialog.addEventListener("click", (event) => {
        // Get the bounding rectangle of the dialog element
        const dialogRect = createProjectDialog.getBoundingClientRect();

        // Check if the click coordinates are outside the dialog's bounding box
        // This means the click was on the backdrop
        if (
            event.clientY < dialogRect.top ||
            event.clientY > dialogRect.bottom ||
            event.clientX < dialogRect.left ||
            event.clientX > dialogRect.right
        ) {
            createProjectDialog.close();
        }
    })
}