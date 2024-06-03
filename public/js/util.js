/**
 * Sets up the back button functionality.
 * If the element with id 'back-link' exists, it sets the 'href' attribute to the previous page's URL
 * and adds an onclick event listener to go back in history when clicked.
 */
if (document.getElementById('back-link')) {
  const backButton = document.getElementById('back-link')
  backButton.setAttribute('href', document.referrer)
  backButton.onclick = function () {
    history.back()
    return false
  }
}

/**
 * Sets up the delete timecard functionality.
 * If the element with id 'open-delete-timecard-modal' exists, it adds an onclick event listener to show the delete timecard modal,
 * prevent the default action, and set the action attribute of the delete timecard form to the appropriate URL.
 */
if (document.getElementById('open-delete-timecard-modal')) {
  const trashcan = document.getElementById('open-delete-timecard-modal')
  trashcan.addEventListener('onclick', function (e) {
    e.preventDefault()
    console.log(e)
    console.log(this)
    document.getElementById('delete-timecard').showModal()
    document
      .getElementById('delete-timecard-form')
      .setAttribute('action', `/admin/archive/${trashcan.dataset.id}`)
  })
}
