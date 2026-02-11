import { useState, useEffect, useMemo } from 'react';
import { isSameMonth, parseISO, subMonths, format } from 'date-fns';
import { tr } from 'date-fns/locale';

const API_URL = 'http://localhost:8070/api';

export const CATEGORY_GROUPS = {
    'Temel Faturalar': ['Elektrik', 'Su', 'Doğalgaz', 'İnternet', 'Telefon'],
    'Günlük Harcamalar': ['Market', 'Ulaşım', 'Eğlence', 'Yeme-İçme', 'Diğer'],
    'Düzenli Ödemeler': ['Kira', 'Kredi Kartı', 'Sigorta', 'Abonelik', 'Kredi Taksit']
};

export const INITIAL_BUDGETS = {
    'Temel Faturalar': 3000,
    'Günlük Harcamalar': 5000,
    'Düzenli Ödemeler': 4000
};

export const useExpenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [budgets, setBudgets] = useState(INITIAL_BUDGETS);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${API_URL}/data`);
                if (!res.ok) throw new Error('Failed to fetch data');
                const data = await res.json();
                setExpenses(data.expenses || []);
                if (data.budgets) {
                    setBudgets(data.budgets);
                }
            } catch (err) {
                console.error("API Error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const addExpense = async (expense) => {
        // Optimistic update
        const tempId = Date.now();
        const tempExpense = { ...expense, id: tempId, amount: parseFloat(expense.amount) };
        setExpenses(prev => [tempExpense, ...prev]);

        try {
            const res = await fetch(`${API_URL}/expenses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(expense)
            });

            if (!res.ok) throw new Error('Failed to add expense');

            const newExpense = await res.json();
            // Replace temp with actual
            setExpenses(prev => prev.map(e => e.id === tempId ? newExpense : e));
        } catch (err) {
            console.error("Add Expense Error:", err);
            // Rollback
            setExpenses(prev => prev.filter(e => e.id !== tempId));
        }
    };

    const removeExpense = async (id) => {
        const oldExpenses = [...expenses];
        setExpenses(prev => prev.filter(e => e.id !== id));

        try {
            const res = await fetch(`${API_URL}/expenses/${id}`, {
                method: 'DELETE'
            });
            if (!res.ok) throw new Error('Failed to delete');
        } catch (err) {
            console.error("Delete Error:", err);
            setExpenses(oldExpenses);
        }
    };

    const updateBudget = async (categoryGroup, amount) => {
        const newAmount = parseFloat(amount);
        setBudgets(prev => ({ ...prev, [categoryGroup]: newAmount }));

        try {
            const res = await fetch(`${API_URL}/budgets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ group: categoryGroup, amount: newAmount })
            });
            if (!res.ok) throw new Error('Failed to update budget');
        } catch (err) {
            console.error("Budget Update Error:", err);
        }
    };

    // --- Calculations (Same as before) ---

    const currentMonthExpenses = useMemo(() => {
        return expenses.filter((e) => isSameMonth(parseISO(e.date), new Date()));
    }, [expenses]);

    const lastMonthExpenses = useMemo(() => {
        const lastMonthDate = subMonths(new Date(), 1);
        return expenses.filter((e) => isSameMonth(parseISO(e.date), lastMonthDate));
    }, [expenses]);

    const stats = useMemo(() => {
        const totalThisMonth = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
        const totalLastMonth = lastMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
        const avgExpense = currentMonthExpenses.length > 0 ? totalThisMonth / currentMonthExpenses.length : 0;

        let change = 0;
        if (totalLastMonth > 0) {
            change = ((totalThisMonth - totalLastMonth) / totalLastMonth) * 100;
        }

        return {
            totalThisMonth,
            totalLastMonth,
            avgExpense,
            change,
            count: currentMonthExpenses.length
        };
    }, [currentMonthExpenses, lastMonthExpenses]);

    const categoryBreakdown = useMemo(() => {
        const breakdown = {};
        Object.keys(CATEGORY_GROUPS).forEach(group => {
            breakdown[group] = currentMonthExpenses
                .filter(e => e.type === group)
                .reduce((sum, e) => sum + e.amount, 0);
        });
        return breakdown;
    }, [currentMonthExpenses]);

    const anomalies = useMemo(() => {
        const alerts = [];
        currentMonthExpenses.forEach(expense => {
            const sameCategory = expenses.filter(e =>
                e.category === expense.category && e.id !== expense.id
            );

            if (sameCategory.length > 0) {
                const avg = sameCategory.reduce((sum, e) => sum + e.amount, 0) / sameCategory.length;
                if (expense.amount > avg * 1.5) {
                    alerts.push({
                        ...expense,
                        avgAmount: avg,
                        deviation: ((expense.amount - avg) / avg * 100).toFixed(0)
                    });
                }
            }
        });
        return alerts;
    }, [currentMonthExpenses, expenses]);

    const predictNextMonth = useMemo(() => {
        const months = [];
        const now = new Date();
        for (let i = 0; i < 3; i++) {
            const d = subMonths(now, i);
            const mTotal = expenses
                .filter(e => isSameMonth(parseISO(e.date), d))
                .reduce((sum, e) => sum + e.amount, 0);
            months.push(mTotal);
        }
        const avg = months.reduce((a, b) => a + b, 0) / (months.length || 1);
        return Math.round(avg);
    }, [expenses]);

    const trendData = useMemo(() => {
        const data = [];
        for (let i = 5; i >= 0; i--) {
            const d = subMonths(new Date(), i);
            const total = expenses
                .filter(e => isSameMonth(parseISO(e.date), d))
                .reduce((sum, e) => sum + e.amount, 0);
            data.push({
                name: format(d, 'MMM', { locale: tr }),
                total: total
            });
        }
        return data;
    }, [expenses]);

    const budgetAlerts = useMemo(() => {
        const alerts = [];
        Object.keys(budgets).forEach(group => {
            const spent = categoryBreakdown[group] || 0;
            const limit = budgets[group];
            const pct = limit > 0 ? (spent / limit) * 100 : 0;

            if (pct >= 100) {
                alerts.push({ group, type: 'danger', pct: pct.toFixed(0), message: `${group} bütçesi aşıldı! (%${pct.toFixed(0)})` });
            } else if (pct >= 80) {
                alerts.push({ group, type: 'warning', pct: pct.toFixed(0), message: `${group} limitine yaklaşıldı (%${pct.toFixed(0)})` });
            }
        });
        return alerts;
    }, [categoryBreakdown, budgets]);


    return {
        expenses,
        addExpense,
        removeExpense,
        budgets,
        updateBudget,
        stats,
        categoryBreakdown,
        anomalies,
        predictNextMonth,
        trendData,
        budgetAlerts,
        CATEGORY_GROUPS,
        loading,
        error
    };
};
