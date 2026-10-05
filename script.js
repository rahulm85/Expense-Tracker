// Browser-only Expense Tracker. Transactions are stored in this browser.
const STORAGE_KEY = 'expense-tracker.transactions.v1';

const transactionForm = document.getElementById('transactionForm');
const descInput = document.getElementById('desc');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const transactionList = document.getElementById('transactionList');
const totalIncomeEl = document.getElementById('totalIncome');
const totalExpenseEl = document.getElementById('totalExpense');
const netBalanceEl = document.getElementById('totalBalance');
const statusMessage = document.getElementById('statusMessage');

const money = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2
});

let transactions = readTransactions();

function readTransactions() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(saved)) return [];

    return saved.filter((item) =>
      item &&
      typeof item.description === 'string' &&
      Number.isFinite(Number(item.amount)) &&
      Number(item.amount) > 0 &&
      ['income', 'expense'].includes(item.type)
    ).map((item) => ({
      id: String(item.id || createId()),
      description: item.description,
      amount: Number(item.amount),
      type: item.type
    }));
  } catch (error) {
    return [];
  }
}

function createId() {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function saveTransactions() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    return true;
  } catch (error) {
    showMessage('Could not save data in this browser. Check its storage settings.', false);
    return false;
  }
}

function showMessage(message, isSuccess) {
  statusMessage.textContent = message;
  statusMessage.classList.toggle('success', Boolean(isSuccess));
}

transactionForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const description = descInput.value.trim();
  const amount = Number(amountInput.value);
  const type = typeInput.value;

  if (description.length < 3 || !Number.isFinite(amount) || amount <= 0 ||
      !['income', 'expense'].includes(type)) {
    showMessage('Enter a description of at least 3 characters and a positive amount.', false);
    return;
  }

  transactions.unshift({
    id: createId(),
    description,
    amount,
    type
  });

  if (!saveTransactions()) {
    transactions.shift();
    return;
  }

  transactionForm.reset();
  typeInput.value = 'income';
  render();
  showMessage('Transaction added.', true);
  descInput.focus();
});

transactionList.addEventListener('click', (event) => {
  const button = event.target.closest('.delete-btn');
  if (!button) return;

  const previous = transactions;
  transactions = transactions.filter((item) => item.id !== button.dataset.id);

  if (!saveTransactions()) {
    transactions = previous;
    return;
  }

  render();
  showMessage('Transaction deleted.', true);
});

function render() {
  renderTransactions();
  renderTotals();
}

function renderTransactions() {
  transactionList.replaceChildren();

  if (transactions.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty-state';
    empty.textContent = 'No transactions added yet.';
    transactionList.appendChild(empty);
    return;
  }

  transactions.forEach((item) => {
    const row = document.createElement('li');
    row.className = 'list-item ' + item.type;

    const description = document.createElement('span');
    description.textContent = item.description;

    const controls = document.createElement('div');
    const amount = document.createElement('strong');
    const sign = item.type === 'income' ? '+' : '-';
    amount.textContent = sign + money.format(item.amount);

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'delete-btn';
    deleteButton.dataset.id = item.id;
    deleteButton.setAttribute('aria-label', 'Delete transaction: ' + item.description);
    deleteButton.textContent = 'Delete';

    controls.append(amount, deleteButton);
    row.append(description, controls);
    transactionList.appendChild(row);
  });
}

function renderTotals() {
  const income = transactions
    .filter((item) => item.type === 'income')
    .reduce((total, item) => total + item.amount, 0);
  const expenses = transactions
    .filter((item) => item.type === 'expense')
    .reduce((total, item) => total + item.amount, 0);

  totalIncomeEl.textContent = money.format(income);
  totalExpenseEl.textContent = money.format(expenses);
  netBalanceEl.textContent = money.format(income - expenses);
}

render();
