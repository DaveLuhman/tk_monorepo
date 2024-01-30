/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const tabsContainer = document.querySelector('#tabs');
const tabTogglers = tabsContainer.querySelectorAll('#tabs a');
const tabContents = document.querySelector('#tab-contents');
const activeEntries = []; // array of jobName elements which contain any value
let dateFields = document.querySelectorAll('[id^="te-date"]'); // array of all date elements
let jobNameFields = document.querySelectorAll('[id^="te-name"]'); // array of all jobName elements
let jobNumberFields = document.querySelectorAll('[id^="te-number-"]'); // array of all jobName elements
let hoursFields = document.querySelectorAll('[id^="te-hours"]'); // array of all hours elements
let overtimeFields = document.querySelectorAll('[id^="te-overtime"]'); // array of all overtime elements
const empNameField = document.querySelector('#empName');
const empEmailField = document.querySelector('#empEmail');
let entriesCount = document.querySelectorAll('[id^="te-name"]').length;
let plusButtons = document.querySelectorAll('#plusButton');
const confirmEntriesBtn = document.querySelector('#confirmEntries');
const submitBtn = document.querySelector('#submitBtn');
const punchCounters = document.querySelectorAll('#punchCounter', '.upticker');
const regHoursCounterEls = document.querySelectorAll('#hoursCounter');
const overtimeCounterEls = document.querySelectorAll('#overtimeCounter');
const validatedFields = document.querySelectorAll('input[validate]');
const validationWarning = document.querySelector('#validationWarning');

document.forms.timeEntryForm.reset();  // clears form on initial page load

const width = window.innerWidth;  //queries window size on page load
for (let i = 0; i < tabContents.children.length; i++) { // sets 'tabs of the week' verbosity based on window size
  if (width <= 500) {
    tabTogglers[i].innerText = ['S', 'M', 'T', 'W', 'T', 'F', 'S'][i];
  }
  if (width > 500 && width < 745) {
    tabTogglers[i].innerText = [
      'Sun',
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sun',
    ][i];
  }
  if (width >= 746) {
    tabTogglers[i].innerText = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ][i];
  }
}

/** --------------   Functions   ----------- */

function updateFieldNodelists() {
  dateFields = document.querySelectorAll('[id^="te-date"]'); // array of all date elements
  jobNameFields = document.querySelectorAll('[id^="te-name"]'); // array of all jobName elements
  jobNumberFields = document.querySelectorAll('[id^="te-number-"]');
  hoursFields = document.querySelectorAll('[id^="te-hours"]'); // array of all hours elements
  overtimeFields = document.querySelectorAll('[id^="te-overtime"]'); // array of all overtime elements
  entriesCount = document.querySelectorAll('[id^="te-name"]').length;
  plusButtons = document.querySelectorAll('#plusButton');
}

/**
 *
 * @name removeEntry
 * @description Removes the containing element, updates the counters, and refreshes the field node lists to reflect the change
 * @param {Node} entry The timeEntry to be removed
 */
function removeEntry(entry) {
  entry.parentElement.remove();
  const index = activeEntries.indexOf(entry.parentElement.id);
  if (index !== -1) activeEntries.splice(index, 1);
  updateFieldNodelists();
  updateCounters();
}

/**
 * @name getTotalHours
 * @description iterates through provided NodeList of fields and totals their value
 * @param {NodeList} hoursFields
 * @return {Number}
 */
function getTotalHours(hoursFields) {
  let hoursTotal = Number(0);
  hoursFields.forEach(function (entry) {
    hoursTotal = hoursTotal + Number(entry.value);
  });
  return hoursTotal;
}

/**
 * @name updateCounters
 * @description updates each counter with the total number of active entries
 */
function updateCounters() {
  punchCounters.forEach((element) => {
    element.display_value = activeEntries.length;
    element.innerText = element.display_value;
  });
  regHoursCounterEls.forEach((element) => {
    element.display_value = getTotalHours(hoursFields);
    element.innerText = element.display_value;
  });
  overtimeCounterEls.forEach((element) => {
    element.display_value = getTotalHours(overtimeFields);
    element.innerText = element.display_value;
  });
}

/**
 * @name formDataToJSON
 * @description iterates through entries and returns a complete JSON object to submit to the API
 * @return {JSON} jsonToSend
 */
function formDataToJSON() {
  let timeEntries = [];
  for (let i = 0; i < entriesCount; i++) {
    const dateEl = document.getElementById('te-date-' + i);
    const jobNameEl = document.getElementById('te-name-' + i);
    const jobNumEl = document.getElementById('te-number-' + i);
    const hoursEl = document.getElementById('te-hours-' + i);
    const overtimeEl = document.getElementById('te-overtime-' + i);
    let jobName = new String(jobNameEl.value).trim()
    let jobNum = new String(jobNumEl.value).trim()
    const entry = {
      date: dateEl.value,
      jobName,
      jobNum,
      hours: hoursEl.value,
      overtime: overtimeEl.value,
    };
    timeEntries.push(entry);
  }
  timeEntries = timeEntries.filter((entry) => entry.jobName !== "")
  const empName = new String(empNameField.value).trim()
  const empEmail = new String(empEmailField.value).trim()
  const now = new Date();
  const jsonToSend = {
    empName,
    empEmail,
    timeEntries,
    dateSubmitted: now,
    sourceURL: document.location.hostname,
  };
  return jsonToSend;
}

/**
 * @name submitForm
 * @desc disables the submitBtn to prevent multiple entries, collects the data to send, builds the appropriate headers, and sends the data. If successful, renders the success page.
 * @param {*} e The event fired by clicking the button
 */
async function submitForm(e) {
  e.preventDefault();
  const submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled = true;
  setTimeout(() => (submitBtn.disabled = false), 2000);
  const response = await fetch('/api/timeEntry', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*.ado.software',
    },
    body: JSON.stringify(formDataToJSON()),
  }).then((response) => response.text()).then((text) => {
    if (text === "Accepted") {
      toastr.options.closeMethod = 'fadeOut';
      toastr.options.closeDuration = 300;
      toastr.options.closeEasing = 'swing';
      toastr.success('Your reponse has been submitted successfully.');
      timeEntryForm.reset();
    } else {
      toastr.options.closeMethod = 'fadeOut';
      toastr.options.closeDuration = 1000;
      toastr.options.closeEasing = 'swing';
      toastr.error('Submit Failed: ' + text);
    }
  })
  console.info(response);

}
/* -------------------- END FUNCTIONS ----------------- */

/*  ----------------------- Start  eventListeners ----------- */

// maps an event listener to each of the 'tabs of the week' to change the formatting based on which tab is selected
tabTogglers.forEach(function (toggler) {
  toggler.addEventListener('click', function (e) {
    e.preventDefault();
    const tabName = this.getAttribute('href');
    for (let i = 0; i < tabContents.children.length; i++) {
      tabTogglers[i].parentElement.classList.remove(
        'rounded-t',
        'border-t',
        'border-r',
        'border-l',
        '-mb-px'
      );
      tabContents.children[i].classList.remove('hidden');
      if ('#' + tabContents.children[i].id === tabName) {
        continue;
      }
      tabContents.children[i].classList.add('hidden');
    }
    e.target.parentElement.classList.add(
      'rounded-t',
      'border-t',
      'border-r',
      'border-l',
      '-mb-px'
    );
  });
});

// Event listener to add new entries to each tab
plusButtons.forEach(function (button, i) {
  button.addEventListener('click', function (e) {
    e.preventDefault();
    const parentDateInput = document.querySelector(`#te-date-${i}`);
    const timeEntryPlus = `<div id='te-${entriesCount}' class="grid md:grid-cols-4 grid-rows-3 gap-4 mt-5">
    <input type="hidden" name="te-date-${entriesCount}" value="${parentDateInput.value}" id="te-date-${entriesCount}">
    <div class="col-span-4 md:col-span-2 row-start-1 px-4 py-2 border-2 border-grey rounded relative">
        <label class="absolute -my-4 -mx-2 bg-white px-2 text-gray-400" for="te-name-${entriesCount}">Job Name</label>
        <input
            class="appearance-none border-2 border-white rounded w-full py-2 text-grey-darker leading-tight focus:outline-none focus:bg-white focus:border-white"
            type="text" name="te-name-${entriesCount}" id="te-name-${entriesCount}" validate>
    </div>
    <div class="col-span-4 md:col-span-2 md:col-start-3 md:row-start-1 px-4 py-2 border-2 border-grey rounded relative">
        <label class="absolute -my-4 -mx-2 bg-white px-2 text-grey-darker" for="te-number-${entriesCount}">Job Number</label>
        <input
            class="appearance-none border-2 border-white rounded w-full py-2 text-grey-darker leading-tight focus:outline-none focus:bg-white focus:border-white"
            type="text" name="te-number-${entriesCount}" id="te-number-${entriesCount}">
    </div>
    <div class="col-span-4 md:col-span-2 md:row-start-2 px-4 py-2 border-2 border-grey rounded relative">
        <label class="absolute -my-4 -mx-2 bg-white px-2 text-grey-darker" for="te-hours-${entriesCount}">Hours</label>
        <input
            class="appearance-none border-2 border-white rounded w-full py-2 text-grey-darker leading-tight focus:outline-none focus:bg-white focus:border-white"
            type="number" name="te-hours-${entriesCount}" id="te-hours-${entriesCount}">
    </div>
    <div class="col-span-4 md:col-span-2 md:col-start-3 md:row-start-2 px-4 py-2 border-2 border-grey rounded relative">
        <label class="absolute -my-4 -mx-2 bg-white border-black px-2 text-grey-darker"
            for="te-overtime-${entriesCount}">Overtime</label>
        <input
            class="appearance-none border-2 border-white rounded w-full py-2 text-grey-darker leading-tight focus:outline-none focus:bg-white focus:border-white"
            type="number" name="te-overtime-${entriesCount}" id="te-overtime-${entriesCount}">
    </div>
    <button  id="minus-button-${entriesCount}" class="md:row-start-3 form-control btn btn-error"><div class="fa-solid fa-trash-can"></div></button>
</div>`;
    this.parentElement.insertAdjacentHTML('afterend', timeEntryPlus);
    // add eventListener to new minusButton field
    document.querySelector(`minus-button-${entriesCount}`).addEventListener('click', function(e) {
      e.preventDefault()
      removeEntry(e.target.parentElement)
      updateCounters()
    })
    // add eventListener to new te-name field
    const newJobNameField = document.querySelector('#te-name-' + entriesCount);
    newJobNameField.addEventListener('input', function (e) {
      // if the field contains a value, and it's ID isn't in the active array, add it
      // if the field is empty AND in the array of active fields, remove it.
      if (
        e.target.value.length > 0 &&
        !activeEntries.includes(e.target.parentElement.parentElement.id)
      ) {
        activeEntries.push(e.target.parentElement.parentElement.id);
      } else if (
        e.target.value.length === 0 &&
        activeEntries.includes(e.target.parentElement.parentElement.id)
      ) {
        const index = activeEntries.indexOf(
          e.target.parentElement.parentElement.id
        );
        activeEntries.splice(index, 1);
      }
      updateCounters();
    });
    const newHoursField = document.querySelector('#te-hours-' + entriesCount);
    newHoursField.addEventListener('input', () => {
      updateCounters();
    });
    const newOvertimeField = document.querySelector(
      '#te-overtime-' + entriesCount
    );
    newOvertimeField.addEventListener('input', () => {
      updateCounters();
    });

    // update jobNameFields for all jobName fields
    updateFieldNodelists();
  });
});

// Event listener to monitor active entries by te-name-# field
jobNameFields.forEach((entry) => {
  entry.addEventListener('input', function (e) {
    if (
      e.target.value.length > 0 && // contains a value
      !activeEntries.includes(e.target.parentElement.parentElement.id) // isn't in the activeEntries array
    ) {
      activeEntries.push(e.target.parentElement.parentElement.id); //add it
    } else if (
      e.target.value.length === 0 && // doesn't contain a value
      activeEntries.includes(e.target.parentElement.parentElement.id) // is in the array
    ) {
      const index = activeEntries.indexOf(
        e.target.parentElement.parentElement.id
      ); // get it's postion in the array
      activeEntries.splice(index, 1); // and remove it
    }
    updateCounters(); // update the punchTotal counters
  });
});

// Event listener to monitor the aggregated hours total
hoursFields.forEach((entry) => {
  entry.addEventListener('input', function (_e) {
    updateCounters();
  });
});

// event listener to monitor the aggregated overtime total
overtimeFields.forEach((entry) => {
  entry.addEventListener('input', function (_e) {
    updateCounters();
  });
});

// event listner to open the confirmation modal on clicking the button
confirmEntriesBtn.addEventListener('click', function (e) {
  e.preventDefault();
  const counters = document.querySelectorAll('.upticker');
  counters.forEach((counter) => {
    counter.innerText = 0;
  });
  document.getElementById('confirmModal').checked = true;
  const speed = 40;
  counters.forEach((counter) => {  // applies animation to each counter on confirm modal
    const animate = () => {
      const value = +counter.display_value;
      const data = +counter.innerText;
      const time = value / speed;
      if (data < value) {
        counter.innerText = Math.ceil(data + time);
        setTimeout(animate, 40);
      } else {
        counter.innerText = value;
      }
    };
    animate();
  });
});

// event listener to submit the post request and redirect on success
submitBtn.addEventListener('click', function (e) {
  e.preventDefault();  // prevents default event behavior
  submitForm(e); // submits the form
  updateCounters(); // resets the counters now that the form has been cleared
  document.getElementById('confirmModal').checked = false;  //closes the confirm modal
});

validatedFields.forEach((field) => validateFieldsOnFocusOut(field)); // binds eventListener to each applicable input field

function validateFieldsOnFocusOut(element) { // wrapper for validation eventListener
  element.addEventListener('focusout', (e) => validateUserInput(e));
}

// global validation object
const validation = {
  empName: false,  // default state, empty name field is invalid
  empEmail: true, // default state, empty email field is valid
  jobNames: false, // default state, 0 jobNames is invalid
  status: function () {  // object method to perform validation check
    empNameField.classList.remove('bg-red-300');
    empEmailField.classList.remove('bg-red-300');
    if (validation.empName && validation.empEmail && validation.jobNames) {  // if all validation states are true, return empty string (falsey)
      return '';
    } else if (!validation.empName) {  // empName validation failure route
      empNameField.classList.add('bg-red-300');
      return 'Please fill in your name';
    } else if (!validation.empEmail) {  //empEmail validation failure route
      empEmailField.classList.add('bg-red-300');
      return 'You must use a valid email address or leave the field blank';
    } else if (!this.jobNames) return 'You must submit at least one job';  // jobName validation failure route
    else throw new Error('Validation falied to complete normally');  // failover validation failure route,  should be unreachable.
  },
};

// parent validation callback function
function validateUserInput(event) {
  let fieldName = String(event.target.id);
  switch (fieldName.substring(0, 4)) {
    case 'empN':
      validateName(event.target.value);
      break;
    case 'te-n':
      validateJobName();
      break;
    case 'empE':
      validateEmail(event.target.value);
      break;
  }
  if (!validation.status()) {
    submitBtn.classList.remove('btn-disabled');
    validationWarning.innerText = `${validation.status()}`;
  } else {
    submitBtn.classList.add('btn-disabled');
    validationWarning.innerText = `${validation.status()}`;
  }
}
// validates that empName field has at least one valid character and no invalid characters
function validateName(elementValue) {
  if (/^[a-zA-Z ,.'-]+$/iu.test(elementValue)) validation.empName = true;
  else validation.empName = false;
}
// validates that email follows RFC5322 or is blank
function validateEmail(elementValue) {
  if (
    /(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(elementValue) ||
    elementValue === ''
  )
    validation.empEmail = true;
  else validation.empEmail = false;
}

// validates that jobName fields != falsey (0/null)
function validateJobName() {
  validation.jobNames = Boolean(activeEntries.length);
}
