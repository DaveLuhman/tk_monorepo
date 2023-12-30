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