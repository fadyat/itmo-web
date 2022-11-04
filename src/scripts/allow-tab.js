document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.querySelector('textarea')

    textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault()

            const tab = " ".repeat(4)
            textarea.setRangeText(
                tab,
                textarea.selectionStart,
                textarea.selectionStart,
                'end'
            )
        }
    })
});