import { useState } from 'react';
import { Layout } from './components/Layout';
import { SummaryCards } from './components/SummaryCards';
import { ExpenseCharts } from './components/ExpenseCharts';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseTable } from './components/ExpenseTable';
import { BudgetSettings } from './components/BudgetSettings'; // Placeholder if not created yet, but in plan
import { useExpenses } from './hooks/useExpenses';
import { AlertTriangle, AlertCircle } from 'lucide-react';

function App() {
  const {
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
    budgetAlerts
  } = useExpenses();

  const [activeTab, setActiveTab] = useState('overview');

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Hoşgeldiniz 👋</h1>
        <p className="text-gray-500 mt-1">Harcamalarınızın genel özeti ve bütçe durumunuz.</p>
      </header>

      {/* Alerts Section */}
      <div className="space-y-3 mb-8">
        {budgetAlerts.map((alert, idx) => (
          <div key={idx} className={`p-4 rounded-xl border flex items-center gap-3 ${alert.type === 'danger'
              ? 'bg-red-50 border-red-100 text-red-800'
              : 'bg-orange-50 border-orange-100 text-orange-800'
            }`}>
            <AlertTriangle size={20} />
            <span className="font-medium">{alert.message}</span>
          </div>
        ))}
        {anomalies.length > 0 && (
          <div className="p-4 rounded-xl border bg-blue-50 border-blue-100 text-blue-800 flex items-center gap-3">
            <AlertCircle size={20} />
            <span className="font-medium">{anomalies.length} adet anormal harcama tespit edildi (ortalamanın üzerinde).</span>
          </div>
        )}
      </div>

      {activeTab === 'overview' && (
        <>
          <SummaryCards stats={stats} prediction={predictNextMonth} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Form & Budget */}
            <div className="lg:col-span-1 space-y-8">
              <ExpenseForm onAdd={addExpense} />
            </div>

            {/* Right Column: Charts & Table */}
            <div className="lg:col-span-2 space-y-8">
              <ExpenseCharts trendData={trendData} categoryBreakdown={categoryBreakdown} />
              <ExpenseTable
                expenses={expenses}
                onDelete={removeExpense}
                anomalies={anomalies}
              />
            </div>
          </div>
        </>
      )}

      {activeTab === 'add' && (
        <div className="max-w-2xl mx-auto">
          <ExpenseForm onAdd={(e) => { addExpense(e); setActiveTab('overview'); }} />
        </div>
      )}

      {activeTab === 'budget' && (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <BudgetSettings
            budgets={budgets}
            onUpdateBudget={updateBudget}
            categoryBreakdown={categoryBreakdown}
          />
          {/* Visualization for budget context could go here */}
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-8">
          <ExpenseCharts trendData={trendData} categoryBreakdown={categoryBreakdown} />
          <ExpenseTable
            expenses={expenses}
            onDelete={removeExpense}
            anomalies={anomalies}
          />
        </div>
      )}

    </Layout>
  );
}

export default App;
