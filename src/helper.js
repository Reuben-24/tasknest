export { formatDateTimeDisplay, closeDialogOnBGClick };

function formatDateTimeDisplay(isoString) {
  if (!isoString) {
    return isoString;
  }

  const date = new Date(isoString);

  return new Intl.DateTimeFormat("en-AU", {
    weekday: "long", // "Monday"
    year: "numeric", // "2025"
    month: "long", // "June"
    day: "numeric", // "23"
    hour: "numeric", // "9"
    minute: "2-digit", // "00"
    hour12: true, // "AM/PM"
  }).format(date);
}

function closeDialogOnBGClick(dialogElement) {
  // Close dialog if backdrop is clicked
  dialogElement.addEventListener("click", (event) => {
    // Get the bounding rectangle of the dialog element
    const dialogRect = dialogElement.getBoundingClientRect();

    // Check if the click coordinates are outside the dialog's bounding box
    if (
      event.clientY < dialogRect.top ||
      event.clientY > dialogRect.bottom ||
      event.clientX < dialogRect.left ||
      event.clientX > dialogRect.right
    ) {
      dialogElement.close();
    }
  });
}
