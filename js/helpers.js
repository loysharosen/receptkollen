const formattedDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}

export const toggleDescription = () => {
  const description = document.querySelector(".description");
  description.classList.toggle("hidden");
}

export const hideDescription = () => {
  const description = document.querySelector(".description");
  description.classList.add("hidden");
}

export const saveAndReset = (event) => {
  event.preventDefault();
  const resultToSave = '<div id="previous-result">' + document.querySelector("#result").innerHTML + '</div>';
  document.querySelector("#result-list").insertAdjacentHTML("afterbegin", resultToSave);
  document.querySelector("#dynamic-result").innerHTML = "";
  document.querySelector("#number-of-doses").focus();
  
  const currentDate = document.querySelector("#date").valueAsDate
  event.target.reset();
  document.querySelector("#date").valueAsDate = new Date(currentDate);
}

export const calculateAndDisplayResult = (event) => {
  event.preventDefault();
  document.querySelector("#dynamic-result").innerHTML = "";
  
  // Get input values
  const numberInPackage = document.querySelector("#number-of-doses");
  const numberOfExpeditions = document.querySelector("#number-of-expeditions")
  const dosesPerDay = document.querySelector("#doses-per-day");
  const date = document.querySelector("#date");

  // Turn empty values into 1
  let numberOfExpeditionsValue = numberOfExpeditions.value;
  if (numberOfExpeditionsValue === "") {
    numberOfExpeditionsValue = "1";
  }

  let dosesPerDayValue = dosesPerDay.value;
  if (dosesPerDayValue === "") {
    dosesPerDayValue = "1";
  }

  // Parse values after handling empty cases
  numberOfExpeditionsValue = parseFloat(numberOfExpeditionsValue.replace(',', '.'));
  dosesPerDayValue = parseFloat(dosesPerDayValue.replace(',', '.'));
  const numberInPackageValue = parseFloat(numberInPackage.value.replace(',', '.'));

  const result = document.querySelector("#dynamic-result");
  const openingTags = '<div id="result"><p>'
  const closingTags = "</p></div>"
  
 // Regex pattern for valid number format (allows integers, decimals with , or .)
 const numberPattern = /^\d*([.,]\d+)?$/;

const validateInput = () => {
  document.querySelector("#dynamic-result").insertAdjacentHTML(
    "beforeend", 
    `${openingTags}Felaktig inmatning. Ange endast positiva tal.${closingTags}`
  );
}

 // Validate input format
 if (!numberPattern.test(numberInPackage.value) || 
     !numberPattern.test(numberOfExpeditions.value || "1") || 
     !numberPattern.test(dosesPerDay.value || "1")) {
   validateInput();
   return;
 } else if (numberInPackageValue === 0 || numberOfExpeditionsValue === 0 || dosesPerDayValue === 0) {
validateInput();
  return;
 }

   // Initiate only if numberInPackage is not empty
   if (numberInPackage.value === "" || date.value === "") {
    return;
  }

  // Calculate Rx duration
  const numberOfDosesValue = numberInPackageValue * numberOfExpeditionsValue;
  const numberOfDays = Math.floor(numberOfDosesValue / dosesPerDayValue);
  const unusedDoses = numberOfDosesValue - (numberOfDays * dosesPerDayValue);
  
  // Calculate last day of Rx
  const startDate = new Date(date.value);
  const lastDay = new Date(startDate.getTime() + ((numberOfDays - 1) * 86400000));

  
  const formattedLastDay = formattedDate(lastDay);
  const formattedStartDate = formattedDate(startDate);
  
  // Create result text SV
  let inputConfirmText;
  if (numberOfExpeditionsValue === 1) {
    inputConfirmText = `Total mängd ${numberInPackageValue.toString().replace('.', ',')}. Dosering ${dosesPerDayValue.toString().replace('.', ',')} per dag. Start ${date.value}.</p>`; 
  } else {
    inputConfirmText = `Total mängd ${numberInPackageValue.toString().replace('.', ',')} x ${numberOfExpeditionsValue.toString().replace('.', ',')} = ${numberOfDosesValue.toString().replace('.', ',')}. Dosering ${dosesPerDayValue.toString().replace('.', ',')} per dag. Start ${date.value}.</p>`;   
  }

  let resultText;
  if (numberOfDays === 1) {
    resultText = `<p><strong>Receptet bör räcka i ${numberOfDays.toString().replace('.', ',')} hel dag, till och med ${formattedLastDay}.</strong>`
  } else if (numberOfDays === 0) {
    resultText = `<p><strong>Receptet räcker i mindre än 1 dag.</strong>`
  } else {
    resultText = `<p><strong>Receptet bör räcka i ${numberOfDays.toString().replace('.', ',')} hela dagar, till och med ${formattedLastDay}.</strong>`
  }

  let unusedDosesText;
  if (resultText === `<p><strong>Receptet räcker i mindre än 1 dag.</strong>`) {
    unusedDosesText = ""  
  } else if (unusedDoses === 1) {
    unusedDosesText = `${unusedDoses.toString().replace('.', ',')} dos blir över.`
  } else if (unusedDoses === 0) {
    unusedDosesText = ""
  } else {
    unusedDosesText = `${unusedDoses.toString().replace('.', ',')} doser blir över.`
  }

  // Insert result into DOM
  if (unusedDoses === 1) {
    result.insertAdjacentHTML("afterbegin",
      `${openingTags}${inputConfirmText} ${resultText} ${unusedDosesText} ${closingTags}`);
  } else if (unusedDoses === 0) {
    result.insertAdjacentHTML("afterbegin",
      `${openingTags}${inputConfirmText} ${resultText} ${closingTags}`);
  } else {
    result.insertAdjacentHTML("afterbegin",
      `${openingTags}${inputConfirmText} ${resultText} ${unusedDosesText} ${closingTags}`);
  }
};