document.addEventListener('DOMContentLoaded', function () {
    const items = document.querySelectorAll('details.faq-item');

    items.forEach(function (details) {
        const answer = details.querySelector('.faq-answer');
        if (!answer) return;

        if (details.open) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
            answer.style.opacity = '1';
        } else {
            answer.style.maxHeight = '0px';
            answer.style.opacity = '0';
        }

        details.addEventListener('toggle', function () {
            const isOpen = details.open;

            if (isOpen) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.opacity = '1';
            } else {
                answer.style.maxHeight = answer.scrollHeight + 'px'; 
                void answer.offsetHeight;
                answer.style.maxHeight = '0px';
                answer.style.opacity = '0';
            }
        });
    });
});
