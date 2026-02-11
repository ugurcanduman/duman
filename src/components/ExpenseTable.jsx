import { Trash2, AlertCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/format';
import { Card } from './Card';
import clsx from 'clsx';

export const ExpenseTable = ({ expenses, onDelete, anomalies }) => {
    if (expenses.length === 0) {
        return (
            <Card className="text-center py-12">
                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="text-gray-400" size={32} />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Henüz harcama yok</h3>
                <p className="text-gray-500 mt-1">Sol taraftaki (veya yukarıdaki) formu kullanarak ilk harcamanızı ekleyin.</p>
            </Card>
        );
    }

    return (
        <Card title="Son Harcamalar" className="overflow-hidden">
            <div className="overflow-x-auto -mx-6">
                <table className="min-w-full text-left text-sm whitespace-nowrap">
                    <thead className="uppercase tracking-wider border-b border-gray-100 bg-gray-50/50 text-xs font-semibold text-gray-500">
                        <tr>
                            <th scope="col" className="px-6 py-4">Tarih</th>
                            <th scope="col" className="px-6 py-4">Açıklama</th>
                            <th scope="col" className="px-6 py-4">Kategori</th>
                            <th scope="col" className="px-6 py-4 text-right">Tutar</th>
                            <th scope="col" className="px-6 py-4 text-right">İşlem</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {expenses.map((expense) => {
                            const isAnomaly = anomalies.some(a => a.id === expense.id);

                            return (
                                <tr
                                    key={expense.id}
                                    className={clsx(
                                        "hover:bg-gray-50/80 transition-colors",
                                        isAnomaly ? "bg-red-50/30" : ""
                                    )}
                                >
                                    <td className="px-6 py-4 text-gray-500">
                                        {formatDate(expense.date)}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                                        {expense.description}
                                        {isAnomaly && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800" title="Ortalamadan %50 daha yüksek">
                                                <AlertCircle size={12} className="mr-1" />
                                                Anormal
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                                            {expense.category}
                                        </span>
                                    </td>
                                    <td className={clsx(
                                        "px-6 py-4 text-right font-semibold",
                                        isAnomaly ? "text-red-600" : "text-gray-900"
                                    )}>
                                        {formatCurrency(expense.amount)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => onDelete(expense.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-1 hover:bg-red-50 rounded-lg"
                                            title="Sil"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};
