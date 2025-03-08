// This file contains the JavaScript code that generates the squares and cubes for numbers 1 to 100,
// handles pagination to show 31 entries on the first page, and manages user interactions.

const totalNumbers = 100;
const entriesPerPage = 31;
let currentPage = 1;

function generateSquaresAndCubes() {
    const container = document.getElementById('squares-cubes-container');
    container.innerHTML = '';

    const start = 1
    const end = 100;

    for (let i = start; i <= end; i++) {
        const square = i * i;
        const cube = i * i * i;

        // Create table row instead of div
        const row = document.createElement('tr');

        // Create table cells for number, square and cube
        const numberCell = document.createElement('td');
        numberCell.textContent = i;

        const squareCell = document.createElement('td');
        squareCell.textContent = square;

        const cubeCell = document.createElement('td');
        cubeCell.textContent = cube;

        // Add cells to the row
        row.appendChild(numberCell);
        row.appendChild(squareCell);
        row.appendChild(cubeCell);

        // Add animation delay for staggered effect
        // Only apply specific delays to first 10 rows to match CSS
        if (i - start < 10) {
            row.style.animationDelay = `${(i - start) * 0.05}s`;
        } else {
            row.style.animationDelay = '0.5s';
        }

        // Add row to the container
        container.appendChild(row);
    }

    updatePaginationButtons();
}

function updatePaginationButtons() {
    const totalPages = Math.ceil(totalNumbers / entriesPerPage);
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    // Update previous button state
    prevBtn.disabled = currentPage === 1;

    // Update next button state
    nextBtn.disabled = currentPage === totalPages;

    // Add page info to next button (optional enhancement)
    prevBtn.title = currentPage > 1 ? `Go to page ${currentPage - 1}` : '';
    nextBtn.title = currentPage < totalPages ? `Go to page ${currentPage + 1}` : '';
}

function goToNextPage() {
    const totalPages = Math.ceil(totalNumbers / entriesPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        generateSquaresAndCubes();
        // Scroll to top of table for better UX
        document.querySelector('table').scrollIntoView({ behavior: 'smooth' });
    }
}

function goToPreviousPage() {
    if (currentPage > 1) {
        currentPage--;
        generateSquaresAndCubes();
        // Scroll to top of table for better UX
        document.querySelector('table').scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Generate the initial squares and cubes
    generateSquaresAndCubes();

    // Add event listeners to pagination buttons
    document.getElementById('next-btn').addEventListener('click', goToNextPage);
    document.getElementById('prev-btn').addEventListener('click', goToPreviousPage);
});