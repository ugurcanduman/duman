const API_URL = 'http://localhost:8070/api';

const addExpense = async () => {
    const expense = {
        description: "Test Script Expense",
        amount: 50.5,
        date: "2026-02-12",
        group: "Günlük Harcamalar",
        category: "Market",
        type: "Günlük Harcamalar"
    };

    console.log("Sending expense:", JSON.stringify(expense));

    try {
        const res = await fetch(`${API_URL}/expenses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(expense)
        });

        console.log("Status:", res.status);
        if (!res.ok) {
            console.error("Failed:", await res.text());
            return;
        }

        const data = await res.json();
        console.log("Success:", data);
    } catch (e) {
        console.error("Fetch Error:", e);
    }
};

addExpense();
