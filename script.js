// Expense Tracker frontend - data is persisted through the Node.js/MySQL REST API
let transactions = [];
const API_URL = '/api/transactions';

const transactionForm = document.getElementById('transactionForm');
const descInput = document.getElementById('desc');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const transactionList = document.getElementById('transactionList');
const totalIncomeEl = document.getElementById('totalIncome');
const totalExpenseEl = document.getElementById('totalExpense');
const netBalanceEl = document.getElementById('netBalance');

async function loadTransactions() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Unable to load transactions');
    transactions = await response.json();
    updateUI();
  } catch (error) {
    transactionList.innerHTML = '<p style="color:#ef4444; text-align:center;">Could not connect to the database API.</p>';
    console.error(error);
  }
}

transactionForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  const description = descInput.value.trim();
  const amount = Number(amountInput.value);
  const type = typeInput.value;

  if (!description || !Number.isFinite(amount) || amount <= 0 || !['income', 'expense'].includes(type)) return;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, amount, type })
    });
    if (!response.ok) throw new Error('Unable to add transaction');
    transactionForm.reset();
    await loadTransactions();
  } catch (error) {
    console.error(error);
    alert('Unable to save transaction. Check that the server and MySQL are running.');
  }
});

transactionList.addEventListener('click', async function (e) {
  if (!e.target.classList.contains('delete-btn')) return;
  const id = Number(e.target.dataset.id);
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Unable to delete transaction');
    await loadTransactions();
  } catch (error) {
    console.error(error);
  }
});

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
    const description = document.createElement('span');
    description.textContent = item.description;
    const controls = document.createElement('div');
    const value = document.createElement('strong');
    value.textContent = `${sign}₹${Number(item.amount).toFixed(2)}`;
    const button = document.createElement('button');
    button.className = 'delete-btn';
    button.dataset.id = item.id;
    button.style.marginLeft = '10px';
    button.textContent = '×';
    controls.append(value, button);
    li.append(description, controls);
    transactionList.appendChild(li);
  });
}

function calculateTotals() {
  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
  totalIncomeEl.textContent = `₹${income.toFixed(2)}`;
  totalExpenseEl.textContent = `₹${expense.toFixed(2)}`;
  netBalanceEl.textContent = `₹${(income - expense).toFixed(2)}`;
}

loadTransactions();