document.addEventListener('DOMContentLoaded', function () {
    let hourInputs = document.querySelectorAll('[id^="te-hours"]');
    let hoursCounters = document.querySelectorAll('[id^="hours-counter"]');
    let overtimeInputs = document.querySelectorAll('[id^="te-overtime"]');
    let overtimeCounters = document.querySelectorAll('[id^="overtime-counter"]');
    let jobNameInputs = document.querySelectorAll('[id^="te-jobName"]');
    let punchCounters = document.querySelectorAll('[id^="punch-counter"]');
    const plusButton = document.getElementById('plus-button')
    let minusButtons = document.querySelectorAll('.minus-button');
    const submitBtn = document.getElementById('submit-button')
    let validatedFields = document.querySelectorAll('input[validate]');
    const empNameField = document.getElementById('empName')
    const empEmailField = document.getElementById('empEmail')
    const validationWarning = document.getElementById('validation-warning')

    let timecardForm = document.forms['timecardForm']

    // FUNCTION DECLARATIONS
    function updateFieldNodelists() {
        hourInputs = document.querySelectorAll('[id^="te-hours"]');
        overtimeInputs = document.querySelectorAll('[id^="te-overtime"]');
        jobNameInputs = document.querySelectorAll('[id^="te-jobName"]');
        minusButtons = document.querySelectorAll('.minus-button');
        validatedFields = document.querySelectorAll('input[validate]');
    }
    function updateTotalHours() {
        let totalHours = 0;
        hourInputs.forEach(function (input) {
            totalHours += Number(input.value);
        });
        hoursCounters.forEach(element => {
            element.textContent = totalHours;
            element.value = totalHours
        })
    }
    function punchCountPlusOne() {
        return new Number(punchCounters[0].textContent) + 1
    }
    function updateOvertimeHours() {
        let overtimeHours = 0;
        overtimeInputs.forEach(function (input) {
            overtimeHours += Number(input.value);
        });
        overtimeCounters.forEach(element => {
            element.textContent = overtimeHours;
            element.value = overtimeHours
        })
    }
    function updatePunchCount() {
        let punchCount = 0
        jobNameInputs.forEach(() => {
            punchCount++
        })
        punchCounters.forEach(element => {
            element.textContent = punchCount;
            element.value = punchCount
        })
    }
    function updateAllCounters() {
        updateTotalHours();
        updateOvertimeHours();
        updatePunchCount()
    }
    function addNewEntryRow() {
        let newTeRow = document.createElement('div')
        newTeRow.classList.add('grid', 'grid-cols-12', 'grid-rows-3', 'md:grid-rows-1')
        if (Number(punchCounters[0].textContent) % 2 == 0) {
            newTeRow.classList.add('bg-base-200')
        }
        else {
            newTeRow.classList.add('bg-base-100')
        }
        newTeRow.innerHTML = `
        <div id='te-${punchCountPlusOne()}'
        class="col-start-1 col-span-11 grid grid-cols-3 md:grid-cols-5 items-center justify-between  justify-items-stretch md:justify-items-center h-8 px-2 my-3 font-light">
        <div class="row-start-2 md:row-start-1 md:col-start-1">
        <label for="te-date-${punchCountPlusOne()}"
            class="md:hidden absolute -my-4 -mx-2 bg-white px-2 text-gray-500 rounded-md drop-shadow-xl">Date</label>
        <input class="update-input" type="date" id="te-date-${punchCountPlusOne()}" name="te-date-${punchCountPlusOne()}" placeholder="Date"/>
        </div>
        <div class="row-start-1 col-start-2 md:row-start-1 md:col-start-2">
        <label for="te-jobName-${punchCountPlusOne()}"
            class="md:hidden absolute -my-4 -mx-2 bg-white px-2 text-gray-500 rounded-md drop-shadow-xl">Job
            Name</label>
            <input class="update-input" type="text" id="te-jobName-${punchCountPlusOne()}" name="te-jobName-${punchCountPlusOne()}" validate placeholder="Job Name"/>
            </div>
            <div class="row-start-1 col-start-3 md:row-start-1 md:col-start-3">
            <label for="te-jobNum-${punchCountPlusOne()}"
                class="md:hidden absolute -my-4 -mx-2 bg-white px-2 text-gray-500 rounded-md drop-shadow-xl">Job
                Num</label>
            <input class="update-input" type="text" id="te-jobNum-${punchCountPlusOne()}" name="te-jobNum-${punchCountPlusOne()}" placeholder="Job Num"/>
            </div>
            <div class="row-start-3 col-start-2 md:row-start-1 md:col-start-4">
            <label for="te-hours-${punchCountPlusOne()}"
                class="md:hidden absolute -my-4 -mx-2 bg-white px-2 text-gray-500 rounded-md drop-shadow-xl">Hours</label>
            <input class="update-input" type="number" step=".25"
            id="te-hours-${punchCountPlusOne()}" name="te-hours-${punchCountPlusOne()}" placeholder="Hours" />
            </div>
            <div class="row-start-3 col-start-3 md:row-start-1 md:col-start-5">
            <label for="te-overtime-${punchCountPlusOne()}"
                class="md:hidden absolute -my-4 -mx-2 bg-white px-2 text-gray-500 rounded-md drop-shadow-xl">Overtime</label>
            <input class="update-input" type="number" step=".25"
            id="te-overtime-${punchCountPlusOne()}" name="te-overtime-${punchCountPlusOne()}" placeholder="OT" />
            </div>
        </div>
        <div id="minus-button" class="row-start-2 md:row-start-1 justify-self-center col-start-12 w-1/3 minus-button my-1">
            <i class="justify-self-center fa-solid fa-minus"></i>
        </div>`
        timeEntries.append(newTeRow)
        updateFieldNodelists()
        applyEventListeners();
        updateAllCounters()
    }

    function removethisRow() {
        let thisRow = this.parentElement
        thisRow.remove()
        updateFieldNodelists()
        updateAllCounters()
    }

    // EVENT LISTENER APPLICATION //
    function applyEventListeners() {
        hourInputs.forEach(function (input) {
            input.addEventListener('input', updateTotalHours);
        });
        overtimeInputs.forEach(function (input) {
            input.addEventListener('input', updateOvertimeHours);
        });
        plusButton.addEventListener('click', addNewEntryRow)
        minusButtons.forEach(function (button) {
            button.addEventListener('click', removethisRow)
        })
        jobNameInputs.forEach(function (input) {
            input.addEventListener('focusout', updatePunchCount)
        })
        console.log('EventListeners are activated')
    }

    validatedFields.forEach((field) => validateFieldsOnFocusOut(field)); // binds eventListener to each applicable input field

    function validateFieldsOnFocusOut(element) { // wrapper for validation eventListener
        element.addEventListener('focusout', (e) => validateUserInput(e));
    }

    submitBtn.onclick = function () {
        updateAllCounters()
        timecardForm.submit()
        return false;
    }
    // global validation object
    const validation = {
        empName: true,  // default state
        empEmail: true, // default state
        jobNames: true, // default state
        status: function () {  // object method to perform validation check
            empNameField.classList.remove('bg-red-400');
            empEmailField.classList.remove('bg-red-400');
            if (validation.empName && validation.empEmail && validation.jobNames) {  // if all validation states are true, return empty string (falsey)
                return '';
            } else if (!validation.empName) {  // empName validation failure route
                empNameField.classList.add('bg-red-400');
                return 'Please fill in your name';
            } else if (!validation.empEmail) {  //empEmail validation failure route
                empEmailField.classList.add('bg-red-400');
                return 'You must use a valid email address or leave the field blank';
            } else if (!this.jobNames) return 'The job name field cannot be blank. Delete the row or add a name.';  // jobName validation failure route
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
            case 'te-j':
                validateJobName();
                break;
            case 'empE':
                validateEmail(event.target.value);
                break;
        }
        if (!validation.status()) {
            submitBtn.classList.remove('btn-disabled', 'border-red-400', 'border-2');
            validationWarning.innerText = `${validation.status()}`;
        } else {
            submitBtn.classList.add('btn-disabled', 'border-red-400', 'border-2');
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

    function validateJobName() {
        let array = Array.from(jobNameInputs)
        array.some(input => input.value.trim() !== '')
        let result = Array.from(jobNameInputs).some(input => input.value.trim() !== '');
        validation.jobNames = Array.from(jobNameInputs).every(input => input.value.trim() !== '');
    }

    //INIT FUNCTION CALLS
    applyEventListeners();
    updateTotalHours();
    updateOvertimeHours();
    updatePunchCount()
});
