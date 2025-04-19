# Getting Started with Node.js

Node.js is a powerful runtime that lets you run JavaScript on the server. Here's a quick guide to get started with Node.js development.

## Installation

First, download Node.js from the official website and install it on your system. You can verify the installation by running:

```bash
node --version
npm --version
```

## Creating a Simple Web Server

Here's a basic example of creating a web server with Node.js:

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello, World!');
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});
```

## Using npm for Package Management

npm (Node Package Manager) comes with Node.js. Here's how to initialize a new project:

```bash
npm init -y
npm install express
```

## Next Steps

- Learn about Express.js for web applications
- Explore async/await for handling asynchronous operations
- Study Node.js security best practices 