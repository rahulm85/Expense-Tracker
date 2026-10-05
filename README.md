# Expense Tracker

A browser-only expense tracker built with HTML, CSS, and JavaScript. Add income and expense transactions, review your history, and see totals update immediately.

## Features

- Add income and expense transactions
- Validate descriptions and positive amounts
- View and delete transactions
- Automatically calculate total income, total expenses, and net balance
- Save transactions in browser local storage so they remain after reopening the page
- Responsive layout for mobile and desktop

## Run locally

Open index.html in a modern browser. No server, database, package installation, or build step is required.

## Data storage

Transactions are stored in local storage for the current browser profile on the current device. They do not sync to another browser or device. Clearing the browser's site data removes them.

## Files

- index.html: page content and transaction form
- style.css: layout and responsive styling
- script.js: transaction handling, calculations, and local storage
