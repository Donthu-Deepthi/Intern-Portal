// DOM Elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

// API Base URL
const API_BASE_URL = 'http://localhost:3001/api';

// Utility Functions
async function fetchData(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    }).format(amount);
}

function formatDate(dateString) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
}

// Login Form Handler
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // For demo purposes, we'll just check if the email matches our demo user
        if (email === 'alexjohnson@example.com') {
            window.location.href = 'dashboard.html';
        } else {
            alert('Invalid credentials. Use the demo credentials provided.');
        }
    });
}

// Signup Form Handler
if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        // For demo purposes, we'll just redirect to dashboard
        alert('Account created successfully! Redirecting to dashboard...');
        window.location.href = 'dashboard.html';
    });
}

// Dashboard Page
if (document.querySelector('.dashboard-container')) {
    document.addEventListener('DOMContentLoaded', async function() {
        // Fetch user data
        const userData = await fetchData('user');
        const rewardsData = await fetchData('rewards');
        
        if (userData) {
            // Update user info
            document.getElementById('welcomeMessage').textContent = `Welcome back, ${userData.name}!`;
            document.getElementById('userEmail').textContent = userData.email;
            document.getElementById('joinedDate').textContent = `Joined ${formatDate(userData.joinedDate)}`;
            document.getElementById('totalRaised').textContent = formatCurrency(userData.totalRaised);
            document.getElementById('rewardsUnlocked').textContent = `${userData.rewardsUnlocked}/5`;
            document.getElementById('referralsMade').textContent = userData.referralsMade;
            document.getElementById('newGoal').textContent = formatCurrency(userData.newGoal);
        }
        
        if (rewardsData) {
            const rewardsContainer = document.getElementById('rewardsContainer');
            
            rewardsData.forEach(reward => {
                const rewardItem = document.createElement('div');
                rewardItem.className = `reward-item ${reward.unlocked ? 'unlocked' : ''}`;
                
                rewardItem.innerHTML = `
                    <h3>
                        ${reward.name}
                        ${reward.unlocked ? '<span class="reward-status">Unlocked</span>' : ''}
                    </h3>
                    <p>${reward.description}</p>
                    <p>$${reward.requiredAmount.toLocaleString()} required</p>
                `;
                
                rewardsContainer.appendChild(rewardItem);
            });
        }
    });
}

// Leaderboard Page
if (document.querySelector('.leaderboard-container')) {
    document.addEventListener('DOMContentLoaded', async function() {
        // Fetch leaderboard data
        const leaderboardData = await fetchData('leaderboard');
        
        if (leaderboardData) {
            const topPerformersContainer = document.getElementById('topPerformers');
            const rankingsListContainer = document.getElementById('rankingsList');
            
            // Display top 3 performers
            const topPerformers = leaderboardData.slice(0, 3);
            topPerformers.forEach(performer => {
                const performerCard = document.createElement('div');
                performerCard.className = 'top-performer-card';
                
                performerCard.innerHTML = `
                    <h2>${performer.name}</h2>
                    <p>${performer.referralCode || performer.referralCode}</p>
                    <p>${formatCurrency(performer.totalRaised || performer.totalRaised)}</p>
                    <p class="position">${performer.position}</p>
                `;
                
                topPerformersContainer.appendChild(performerCard);
            });
            
            // Display full rankings
            leaderboardData.forEach((intern, index) => {
                const rankingItem = document.createElement('div');
                rankingItem.className = 'ranking-item';
                
                rankingItem.innerHTML = `
                    <div class="rank">#${index + 1}</div>
                    <div class="details">
                        <div class="name">${intern.name}</div>
                        <div class="referral-code">${intern.referralCode || intern.referralCode} - Joined ${intern.joinedDate ? formatDate(intern.joinedDate) : ''}</div>
                    </div>
                    <div class="amount">${formatCurrency(intern.totalRaised || intern.totalRaised)}</div>
                `;
                
                rankingsListContainer.appendChild(rankingItem);
            });
        }
    });
}