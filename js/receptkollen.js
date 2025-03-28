import { calculateAndDisplayResult, toggleDescription, saveAndReset, hideDescription } from "./helpers.js";

  // Toggle description
document.querySelector(".clickable").addEventListener("click", (event) => {
  event.stopPropagation(); // Prevent click from bubbling to document
  toggleDescription();
});

// Hide description when clicking anywhere else on the document
document.addEventListener("click", () => {
  hideDescription();
});


// Default form to today's date
const date = document.querySelector("#date");
date.valueAsDate = new Date();


// ------------------------------ Submit form START ------------------------------ 
document.querySelector("#aidrx-form").addEventListener("keyup", (event) => {
  calculateAndDisplayResult(event);
});

date.addEventListener("change", (event) => {
  calculateAndDisplayResult(event);
});

document.querySelector("#aidrx-form").addEventListener("submit", (event) => {
  saveAndReset(event);
});
// ------------------------------ Submit form END ------------------------------ 