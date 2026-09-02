// State Management
let transactions = JSON.parse(localStorage.getItem('expenses')) || [];
let budget = parseFloat(localStorage.getItem('monthlyBudget')) || 50000;
let expenseChart; // Chart instance

function save() {
    localStorage.setItem('expenses', JSON.stringify(transactions));
    render();
}

// UI Elements
const modal = document.getElementById('modal');
document.getElementById('add-btn').addEventListener('click', () => modal.classList.remove('hidden'));
document.getElementById('close-modal').addEventListener('click', () => modal.classList.add('hidden'));

// Set Budget
document.getElementById('set-budget-btn').addEventListener('click', () => {
    const newBudget = parseFloat(document.getElementById('budget-input').value);
    if (!isNaN(newBudget) && newBudget > 0) {
        budget = newBudget;
        localStorage.setItem('monthlyBudget', budget);
        render();
    }
});

document.getElementById('transaction-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const newTx = {
        id: Date.now(),
        subject: document.getElementById('subject').value,
        category: document.getElementById('category').value,
        amount: parseFloat(document.getElementById('amount').value)
    };
    transactions.push(newTx);
    modal.classList.add('hidden');
    save();
});

function deleteTx(id) {
    transactions = transactions.filter(t => t.id !== id);
    save();
}

// Initialize/Update Chart
function updateChart() {
    const categories = ['Food', 'Transport', 'Housing', 'Shopping'];
    const data = categories.map(cat =>
        transactions.filter(t => t.category === cat).reduce((sum, t) => sum + t.amount, 0)
    );

    const ctx = document.getElementById('expenseChart').getContext('2d');

    if (expenseChart) {
        expenseChart.data.datasets[0].data = data;
        expenseChart.update();
    } else {
        expenseChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: categories,
                datasets: [{
                    data: data,
                    backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
                }]
            },
            options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
        });
    }
}

function render() {
    const total = transactions.reduce((sum, t) => sum + t.amount, 0);
    const body = document.getElementById('transaction-body');
    body.innerHTML = transactions.map(t => `
        <tr>
            <td>${t.subject}</td>
            <td>${t.category}</td>
            <td>₹${t.amount.toLocaleString('en-IN')}</td>
            <td><button onclick="deleteTx(${t.id})" style="color:var(--red); border:none; background:none; cursor:pointer;">Delete</button></td>
        </tr>
    `).join('');

    // Budget Logic
    const percentage = (total / budget) * 100;
    const fill = document.getElementById('progress-fill');

    fill.style.width = `${Math.min(percentage, 100)}%`;
    fill.style.background = percentage > 100 ? 'var(--red)' : (percentage > 80 ? '#f59e0b' : 'var(--primary)');

    document.getElementById('budget-text').innerText = `₹${total.toLocaleString('en-IN')} / ₹${budget.toLocaleString('en-IN')}`;

    // Update Chart
    updateChart();

    // Clear input
    document.getElementById('budget-input').value = '';
    document.getElementById('subject').value = '';
    document.getElementById('amount').value = '';
}

render();