import { useState } from 'react';
import { Save } from 'lucide-react';
import { Card } from './Card';
import { formatCurrency } from '../utils/format';
import clsx from 'clsx';

export const BudgetSettings = ({ budgets, onUpdateBudget, categoryBreakdown }) => {
    const [editing, setEditing] = useState(null);
    const [tempValue, setTempValue] = useState('');

    const handleEdit = (group) => {
        setEditing(group);
        setTempValue(budgets[group]);
    };

    const handleSave = (group) => {
        onUpdateBudget(group, tempValue);
        setEditing(null);
    };

    return (
        <Card title="Bütçe Ayarları" className="h-full">
            <div className="space-y-6">
                {Object.entries(budgets).map(([group, limit]) => {
                    const spent = categoryBreakdown[group] || 0;
                    const percentage = Math.min((spent / limit) * 100, 100);
                    const isDanger = percentage >= 100;
                    const isWarning = percentage >= 80 && !isDanger;

                    return (
                        <div key={group} className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-medium text-gray-700">{group}</span>
                                <div className="flex items-center gap-2">
                                    <span className={clsx(
                                        "text-xs font-semibold px-2 py-0.5 rounded",
                                        isDanger ? "bg-red-100 text-red-700" :
                                            isWarning ? "bg-orange-100 text-orange-700" :
                                                "bg-green-100 text-green-700"
                                    )}>
                                        %{percentage.toFixed(0)}
                                    </span>
                                    {editing === group ? (
                                        <div className="flex items-center gap-1">
                                            <input
                                                type="number"
                                                className="w-20 px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-indigo-500"
                                                value={tempValue}
                                                onChange={(e) => setTempValue(e.target.value)}
                                                autoFocus
                                            />
                                            <button
                                                onClick={() => handleSave(group)}
                                                className="p-1 text-green-600 hover:bg-green-50 rounded"
                                            >
                                                <Save size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <span
                                            onClick={() => handleEdit(group)}
                                            className="cursor-pointer hover:underline text-gray-500 hover:text-indigo-600"
                                            title="Düzenlemek için tıklayın"
                                        >
                                            {formatCurrency(spent)} / <strong>{formatCurrency(limit)}</strong>
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={clsx(
                                        "h-full rounded-full transition-all duration-500",
                                        isDanger ? "bg-red-500" :
                                            isWarning ? "bg-orange-500" :
                                                "bg-emerald-500"
                                    )}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 p-4 bg-indigo-50/50 rounded-xl text-xs text-indigo-800 border border-indigo-100">
                <p>💡 <strong>İpucu:</strong> Limit değerini değiştirmek için rakamın üzerine tıklayın.</p>
                <p className="mt-1">Bütçenizin %80'ine ulaştığınızda turuncu, tamamını aştığınızda kırmızı uyarı görürsünüz.</p>
            </div>
        </Card>
    );
};
