// Array to store transactions
let transactions = [];

// DOM Elements
const transactionForm = document.getElementById('transactionForm');
const descInput = document.getElementById('desc');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const transactionList = document.getElementById('transactionList');

const totalIncomeEl = document.getElementById('totalIncome');
const totalExpenseEl = document.getElementById('totalExpense');
const netBalanceEl = document.getElementById('netBalance');

// Event Listener for Form Submit
transactionForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const desc = descInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const type = typeInput.value;

  if (!desc || isNaN(amount)) return;

  const transaction = {
    id: Date.now(),
    desc: desc,
    amount: amount,
    type: type
  };

  transactions.push(transaction);

  // Reset inputs
  transactionForm.reset();

  updateUI();
});

// Event Delegation for Deleting Items
transactionList.addEventListener('click', function (e) {
  if (e.target.classList.contains('delete-btn')) {
    const id = Number(e.target.getAttribute('data-id'));
    transactions = transactions.filter(item => item.id !== id);
    updateUI();
  }
});

// Update DOM and Totals
function updateUI() {
  renderList();
  calculateTotals();
}

function renderList() {
  transactionList.innerHTML = '';

  if (transactions.length === 0) {
    transactionList.innerHTML = '<p style="color:#94a3b8; text-align:center;">No transactions added yet.</p>';
    return;
  }

  transactions.forEach(item => {
    const li = document.createElement('li');
    li.className = `list-item ${item.type}`;

    const sign = item.type === 'income' ? '+' : '-';

    li.innerHTML = `
      <span>${item.desc}</span>
      <div>
        <strong>${sign}₹${item.amount.toFixed(2)}</strong>
        <button class="delete-btn" data-id="${item.id}" style="margin-left:10px;">&times;</button>
      </div>
    `;

    transactionList.appendChild(li);
  });
}

function calculateTotals() {
  const income = transactions
    .filter(item => item.type === 'income')
    .reduce((acc, item) => acc + item.amount, 0);

  const expense = transactions
    .filter(item => item.type === 'expense')
    .reduce((acc, item) => acc + item.amount, 0);

  const balance = income - expense;

  totalIncomeEl.textContent = `₹${income.toFixed(2)}`;
  totalExpenseEl.textContent = `₹${expense.toFixed(2)}`;
  netBalanceEl.textContent = `₹${balance.toFixed(2)}`;
}

// Initial render
updateUI();