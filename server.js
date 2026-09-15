const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'expense_tracker',
  waitForConnections: true,
  connectionLimit: 10
});

app.use(express.json());
app.use(express.static(__dirname));

app.get('/api/transactions', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, description, amount, type, transaction_date FROM transactions ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
});

app.post('/api/transactions', async (req, res) => {
  const { description, amount, type } = req.body;
  const numericAmount = Number(amount);
  if (!description || !Number.isFinite(numericAmount) || numericAmount <= 0 || !['income', 'expense'].includes(type)) {
    return res.status(400).json({ message: 'Invalid transaction data' });
  }

  try {
    const [result] = await pool.execute(
      'INSERT INTO transactions (description, amount, type) VALUES (?, ?, ?)',
      [description.trim(), numericAmount, type]
    );
    res.status(201).json({ id: result.insertId, description: description.trim(), amount: numericAmount, type });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create transaction' });
  }
});

app.delete('/api/transactions/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: 'Invalid transaction id' });

  try {
    const [result] = await pool.execute('DELETE FROM transactions WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Transaction not found' });
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete transaction' });
  }
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(PORT, () => console.log(`Expense Tracker running at http://localhost:${PORT}`));