const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = 8070;
const DB_FILE = path.join(__dirname, 'db.json');

// Helper to read DB
const readDb = () => {
    if (!fs.existsSync(DB_FILE)) {
        const initialData = {
            expenses: [],
            budgets: {
                'Temel Faturalar': 3000,
                'Günlük Harcamalar': 5000,
                'Düzenli Ödemeler': 4000
            }
        };
        fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
        return initialData;
    }
    const data = fs.readFileSync(DB_FILE);
    return JSON.parse(data);
};

// Helper to write DB
const writeDb = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

const server = http.createServer((req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    // Helper for JSON response
    const jsonResponse = (data, status = 200) => {
        res.writeHead(status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    };

    // Helper to parse body
    const parseBody = (callback) => {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                callback(JSON.parse(body));
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
    };

    // Endpoints
    if (pathname === '/api/data' && req.method === 'GET') {
        const data = readDb();
        jsonResponse(data);
    }
    else if (pathname === '/api/expenses' && req.method === 'POST') {
        parseBody((body) => {
            const data = readDb();
            const newExpense = { ...body, id: crypto.randomUUID() };
            data.expenses.unshift(newExpense);
            writeDb(data);
            jsonResponse(newExpense, 201);
        });
    }
    else if (pathname.match(/^\/api\/expenses\/([\w-]+)$/) && req.method === 'DELETE') {
        const id = pathname.match(/^\/api\/expenses\/([\w-]+)$/)[1];
        const data = readDb();
        const initialLength = data.expenses.length;
        data.expenses = data.expenses.filter(e => e.id !== id);

        if (data.expenses.length === initialLength) {
            jsonResponse({ error: 'Expense not found' }, 404);
        } else {
            writeDb(data);
            jsonResponse({ message: 'Deleted successfully' });
        }
    }
    else if (pathname === '/api/budgets' && req.method === 'POST') {
        parseBody((body) => {
            const { group, amount } = body;
            if (!group || amount === undefined) {
                jsonResponse({ error: 'Invalid data' }, 400);
                return;
            }
            const data = readDb();
            data.budgets[group] = parseFloat(amount);
            writeDb(data);
            jsonResponse(data.budgets);
        });
    }
    else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
