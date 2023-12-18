
function collapseRow(element) {
    // get the height of the element's inner content, regardless of its actual size
    var rowHeight = element.scrollHeight;

    // temporarily disable all css transitions
    var elementTransition = element.style.transition;
    element.style.transition = '';

    // on the next frame (as soon as the previous style change has taken effect),
    // explicitly set the element's height to its current pixel height, so we
    // aren't transitioning out of 'auto'
    requestAnimationFrame(function () {
        element.style.height = rowHeight + 'px';
        element.style.transition = elementTransition;

        // on the next frame (as soon as the previous style change has taken effect),
        // have the element transition to height: 0
        requestAnimationFrame(function () {
            element.style.height = 0 + 'px';
        });
    });

    // mark the row as "currently collapsed"
    element.setAttribute('data-collapsed', 'true');
}

function expandRow(element) {
    // get the height of the element's inner content, regardless of its actual size
    var rowHeight = element.scrollHeight;

    // have the element transition to the height of its inner content
    element.style.height = rowHeight + 'px';

    // when the next css transition finishes (which should be the one we just triggered)
    element.addEventListener('transitionend', function (e) {
        // remove this event listener so it only gets triggered once
        element.removeEventListener('transitionend', arguments.callee);

        // remove "height" from the element's inline styles, so it can return to its initial value
        element.style.height = null;
    });

    // mark the row as "currently not collapsed"
    element.setAttribute('data-collapsed', 'false');
}

document.querySelectorAll('tr.data-row').addEventListener('click', function (e) {
    var row = document.querySelector('.row.collapsible');
    var isCollapsed = row.getAttribute('data-collapsed') === 'true';

    if (isCollapsed) {
        expandRow(row)
        row.setAttribute('data-collapsed', 'false')
    } else {
        collapseRow(row)
    }
});