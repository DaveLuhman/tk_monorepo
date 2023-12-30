if (document.getElementById('back-link')) {
    const backButton = document.getElementById('back-link');
    backButton.setAttribute('href', document.referrer);
    backButton.onclick = function () {
        history.back();
        return false;
    }
}