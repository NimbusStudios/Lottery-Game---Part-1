document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const userModeBtn = document.getElementById('user-mode-btn');
    const adminModeBtn = document.getElementById('admin-mode-btn');
    const landingPage = document.getElementById('landing-page');
    const userMode = document.getElementById('user-mode');
    const adminMode = document.getElementById('admin-mode');
    const numberSelectionPage = document.getElementById('number-selection-page');
    const proceedBtn = document.getElementById('proceed-btn');
    const confirmationPage = document.getElementById('confirmation-page');
    const confirmBtn = document.getElementById('confirm-btn');
    const notificationPage = document.getElementById('notification-page');
    const simulateDrawBtn = document.getElementById('simulate-draw-btn');
    const drawResults = document.getElementById('draw-results');
    const historyPage = document.getElementById('history-page');
    
    const numberGrid = document.getElementById('number-grid');
    const boardsCountInput = document.getElementById('boards-count');
    const lottoPlus1Checkbox = document.getElementById('lotto-plus1');
    const lottoPlus2Checkbox = document.getElementById('lotto-plus2');
    const summaryDiv = document.getElementById('summary');
    const notificationsDiv = document.getElementById('notifications');
    const historyDiv = document.getElementById('history');

    let selectedNumbers = [];
    let tickets = [];
    let drawHistory = JSON.parse(localStorage.getItem('drawHistory')) || [];

    // Switch to User Mode
    userModeBtn.addEventListener('click', () => {
        landingPage.style.display = 'none';
        userMode.style.display = 'block';
        numberSelectionPage.style.display = 'block';
        generateNumberGrid();
    });
    
    // Switch to Admin Mode
    adminModeBtn.addEventListener('click', () => {
        landingPage.style.display = 'none';
        adminMode.style.display = 'block';
        drawResults.style.display = 'block';
        displayDrawHistory();
    });
    
    // Generate Number Grid
    function generateNumberGrid() {
        for (let i = 1; i <= 52; i++) {
            const numberButton = document.createElement('button');
            numberButton.textContent = i;
            numberButton.classList.add('number-button');
            setBallColor(numberButton, i);
            numberGrid.appendChild(numberButton);
            
            numberButton.addEventListener('click', () => {
                if (selectedNumbers.includes(i)) {
                    selectedNumbers = selectedNumbers.filter(num => num !== i);
                    numberButton.classList.remove('selected');
                } else {
                    if (selectedNumbers.length < 6) {
                        selectedNumbers.push(i);
                        numberButton.classList.add('selected');
                    } else {
                        alert('You can only select 6 numbers.');
                    }
                }
            });
        }
    }

    // Set ball color based on number range
    function setBallColor(button, number) {
        if (number >= 1 && number <= 13) {
            button.style.backgroundColor = 'red';
        } else if (number >= 14 && number <= 25) {
            button.style.backgroundColor = 'yellow';
        } else if (number >= 26 && number <= 37) {
            button.style.backgroundColor = 'green';
        } else if (number >= 38 && number <= 52) {
            button.style.backgroundColor = 'blue';
        }
    }
    
    // Proceed to Confirmation Page
    proceedBtn.addEventListener('click', () => {
        const boardsCount = parseInt(boardsCountInput.value);
        if (selectedNumbers.length !== 6) {
            alert('You must select exactly 6 numbers.');
            return;
        }
        if (isNaN(boardsCount) || boardsCount < 1 || boardsCount > 10) {
            alert('Please enter a valid number of boards (1-10).');
            return;
        }

        const lottoPlus1 = lottoPlus1Checkbox.checked;
        const lottoPlus2 = lottoPlus2Checkbox.checked;

        generateTickets(boardsCount, selectedNumbers, lottoPlus1, lottoPlus2);
        displaySummary();
        
        numberSelectionPage.style.display = 'none';
        confirmationPage.style.display = 'block';
    });

    // Generate tickets based on user selection
    function generateTickets(boardsCount, selectedNumbers, lottoPlus1, lottoPlus2) {
        const ticketId = `T${Date.now()}`;
        const purchaseDate = new Date().toLocaleDateString();
        const boards = [];
    
        for (let i = 0; i < boardsCount; i++) {
            const numbers = i === 0 ? selectedNumbers : generateUniqueNumbers(selectedNumbers);
            boards.push({
                numbers,
                lottoPlus1,
                lottoPlus2
            });
        }
    
        const totalCost = calculateTotalCost(boardsCount, lottoPlus1, lottoPlus2);
    
        tickets.push({
            ticketId,
            purchaseDate,
            boards,
            totalCost
        });
    
        localStorage.setItem('tickets', JSON.stringify(tickets));
    }
    
    function generateUniqueNumbers(selectedNumbers) {
        const numbers = [];
        while (numbers.length < 6) {
            const number = Math.floor(Math.random() * 52) + 1;
            if (!numbers.includes(number) && !selectedNumbers.includes(number)) {
                numbers.push(number);
            }
        }
        return numbers;
    }
    // Calculate total cost based on boards and options
    function calculateTotalCost(boardsCount, lottoPlus1, lottoPlus2) {
        let cost = boardsCount * 5;
        if (lottoPlus1) cost += boardsCount * 2.5;
        if (lottoPlus2) cost += boardsCount * 2.5;
        return cost;
    }

    // Display summary of selected tickets
    function displaySummary() {
        summaryDiv.innerHTML = '';
        tickets.forEach(ticket => {
            const ticketDiv = document.createElement('div');
            ticketDiv.innerHTML = `
                <h3>Ticket ID: ${ticket.ticketId}</h3>
                <p>Purchase Date: ${ticket.purchaseDate}</p>
                <p>Boards:</p>
                <ul>
                    ${ticket.boards.map(board => `
                        <li>
                            Numbers: ${board.numbers.join(', ')} <br>
                            Lotto Plus 1: ${board.lottoPlus1 ? 'Yes' : 'No'} <br>
                            Lotto Plus 2: ${board.lottoPlus2 ? 'Yes' : 'No'}
                        </li>
                    `).join('')}
                </ul>
                <p>Total Cost: R${ticket.totalCost.toFixed(2)}</p>
            `;
            summaryDiv.appendChild(ticketDiv);
        });
    }

    // Confirm Purchase
    confirmBtn.addEventListener('click', () => {
        confirmationPage.style.display = 'none';
        notificationPage.style.display = 'block';
        notificationsDiv.innerHTML = 'Purchase confirmed!';
    });
    
    // Simulate Draw
    simulateDrawBtn.addEventListener('click', () => {
        const winningNumbers = generateWinningNumbers();
        drawResults.innerHTML = `Winning Numbers: ${winningNumbers.join(', ')}`;
        checkWinningTickets(winningNumbers);
        saveDrawHistory(winningNumbers);
    });

    // Generate Winning Numbers
    function generateWinningNumbers() {
        const numbers = [];
        while (numbers.length < 6) {
            const number = Math.floor(Math.random() * 52) + 1;
            if (!numbers.includes(number)) {
                numbers.push(number);
            }
        }
        return numbers;
    }

    // Check Winning Tickets
    function checkWinningTickets(winningNumbers) {
        let winners = [];
        tickets.forEach(ticket => {
            ticket.boards.forEach(board => {
                const matches = board.numbers.filter(num => winningNumbers.includes(num)).length;
                if (matches >= 3) {
                    winners.push({ ticketId: ticket.ticketId, matches });
                }
            });
        });

        if (winners.length > 0) {
            alert(`We have ${winners.length} winning ticket(s)!`);
            winners.forEach(winner => {
                alert(`Ticket ${winner.ticketId} matched ${winner.matches} numbers!`);
            });
        } else {
            alert('No winning tickets.');
        }
    }

    // Save Draw History
    function saveDrawHistory(winningNumbers) {
        const drawDate = new Date().toLocaleDateString();
        drawHistory.push({ drawDate, winningNumbers });
        localStorage.setItem('drawHistory', JSON.stringify(drawHistory));
    }

    // Display Draw History
    function displayDrawHistory() {
        historyDiv.innerHTML = '';
        drawHistory.forEach(draw => {
            const drawDiv = document.createElement('div');
            drawDiv.innerHTML = `
                <h3>Draw Date: ${draw.drawDate}</h3>
                <p>Winning Numbers: ${draw.winningNumbers.join(', ')}</p>
            `;
            historyDiv.appendChild(drawDiv);
        });
    }
    numberButton.addEventListener('click', () => {
        console.log('Button clicked');
        if (selectedNumbers.includes(i)) {
            selectedNumbers = selectedNumbers.filter(num => num !== i);
            numberButton.classList.remove('selected');
        } else {
            if (selectedNumbers.length < 6) {
                selectedNumbers.push(i);
                numberButton.classList.add('selected');
            } else {
                alert('You can only select 6 numbers.');
            }
        }
    });
});
