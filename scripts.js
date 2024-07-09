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
    
});
