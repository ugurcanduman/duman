import { useState, useEffect } from 'react';
import { Plus, Calendar, Tag, FileText, DollarSign } from 'lucide-react';
import { Card } from './Card';
import { CATEGORY_GROUPS } from '../hooks/useExpenses';
import clsx from 'clsx';

// InputGroup component moved outside to prevent re-creation on every render
const InputGroup = ({ icon: Icon, children }) => (
    <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Icon size={18} />
        </div>
        {children}
    </div>
);

export const ExpenseForm = ({ onAdd }) => {
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        group: 'Temel Faturalar',
        category: CATEGORY_GROUPS['Temel Faturalar'][0]
    });

    // Update category when group changes
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            category: CATEGORY_GROUPS[prev.group][0]
        }));
    }, [formData.group]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({
            ...formData,
            amount: parseFloat(formData.amount),
            type: formData.group // Mapping group to type for consistency
        });
        // Reset form but keep date and group/category
        setFormData(prev => ({
            ...prev,
            description: '',
            amount: ''
        }));
    };

    const inputClasses = "pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-3 transition-colors";

    return (
        <Card title="Yeni Harcama Ekle" className="sticky top-6">
            <form onSubmit={handleSubmit} className="space-y-5">

                {/* Group Selection */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Harcama Türü</label>
                    <div className="grid grid-cols-1 gap-2">
                        {Object.keys(CATEGORY_GROUPS).map(group => (
                            <button
                                key={group}
                                type="button"
                                onClick={() => setFormData({ ...formData, group })}
                                className={clsx(
                                    "px-4 py-2 text-sm font-medium rounded-lg border transition-all text-left",
                                    formData.group === group
                                        ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm"
                                        : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                                )}
                            >
                                {group}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Category Selection */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Alt Kategori</label>
                    <InputGroup icon={Tag}>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className={inputClasses}
                        >
                            {CATEGORY_GROUPS[formData.group].map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </InputGroup>
                </div>

                {/* Amount */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Tutar</label>
                    <InputGroup icon={DollarSign}>
                        <input
                            type="number"
                            step="0.01"
                            required
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            className={inputClasses}
                        />
                    </InputGroup>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Açıklama</label>
                    <InputGroup icon={FileText}>
                        <input
                            type="text"
                            required
                            placeholder="Örn: Ocak ayı faturası"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className={inputClasses}
                        />
                    </InputGroup>
                </div>

                {/* Date */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Tarih</label>
                    <InputGroup icon={Calendar}>
                        <input
                            type="date"
                            required
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className={inputClasses}
                        />
                    </InputGroup>
                </div>

                <button
                    type="submit"
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all active:scale-[0.98]"
                >
                    <Plus size={20} className="mr-2" />
                    Harcama Ekle
                </button>
            </form>
        </Card>
    );
};
