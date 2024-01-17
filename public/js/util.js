if (document.getElementById('back-link')) {
    const backButton = document.getElementById('back-link');
    backButton.setAttribute('href', document.referrer);
    backButton.onclick = function () {
        history.back();
        return false;
    }
}

if (document.getElementById('open-delete-timecard-modal')) {
    const trashcan = document.getElementById('open-delete-timecard-modal')
    trashcan.addEventListener('onclick', function (e) {
        e.preventDefault()
        console.log(e)
        console.log(this)
        document.getElementById('delete-timecard').showModal()
        document.getElementById('delete-timecard-form').setAttribute('action', `/admin/archive/${trashcan.dataset.id}`)
    })
}

if (document.getElementsByClassName('download-timecard-button')) {

    const downloadButtons = document.getElementsByClassName('download-timecard-button')
    for (let i = 0; i < downloadButtons.length; i++) {
        downloadButtons[i].addEventListener('click', function (e) {
            const timecardId = downloadButtons[i].dataset.id
            console.log(timecardId)
            fetch(`/admin/generate/${timecardId}`).then(response => response.text()).then((text) => {
                if (text != "OK") {
                    toastr.options.closeMethod = 'fadeOut';
                    toastr.options.closeDuration = 1000;
                    toastr.options.closeEasing = 'swing';
                    toastr.error('Request Failed: ' + text);
                    console.log(text)
                }
            })

        })
    }
}