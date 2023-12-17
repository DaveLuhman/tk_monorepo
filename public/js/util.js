function toggleFrame(row) {
    const nextRow = row.nextElementSibling;
    if (nextRow && nextRow.classList.contains('hidden-frame')) {
        nextRow.classList.toggle('max-h-0');
        nextRow.classList.toggle('max-h-10 '); // Ensure this matches the custom utility
    }
}

const hiddenFrames = document.querySelectorAll('tr.data-row');
hiddenFrames.forEach((row) => {
    row.addEventListener('click', function(e) {
        const currentRow = e.currentTarget;
        toggleFrame(currentRow);
    });
});