import { TrendingUp, TrendingDown, Activity, Calendar, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../utils/format';
import { Card } from './Card'; // Ensure correct import path
import clsx from 'clsx'; // Ensure clsx is imported if used

const StatCard = ({ title, value, subValue, icon: Icon, trend, trendValue, color }) => (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-${color}-500`}>
            <Icon size={48} />
        </div>

        <div className="relative z-10">
            <p className="text-sm font-medium text-muted uppercase tracking-wider mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{value}</h3>

            <div className="flex items-center gap-2">
                {trend && (
                    <span className={clsx(
                        "text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1",
                        trend === 'up' ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
                    )}>
                        {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {trendValue}
                    </span>
                )}
                {subValue && (
                    <span className="text-xs text-muted font-medium">{subValue}</span>
                )}
            </div>
        </div>
    </div>
);

export const SummaryCards = ({ stats, prediction }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
                title="Bu Ay Toplam"
                value={formatCurrency(stats.totalThisMonth)}
                icon={Activity}
                color="indigo"
                trend={stats.change > 0 ? 'up' : 'down'}
                trendValue={`%${Math.abs(stats.change).toFixed(1)}`}
                subValue="Geçen aya göre"
            />

            <StatCard
                title="Ortalama (Aylık)"
                value={formatCurrency(stats.avgExpense)}
                icon={Calendar}
                color="blue"
                subValue={`${stats.count} işlem`}
            />

            <StatCard
                title="Geçen Ay"
                value={formatCurrency(stats.totalLastMonth)}
                icon={TrendingDown}
                color="gray"
            />

            <StatCard
                title="Gelecek Ay Tahmini"
                value={formatCurrency(prediction)}
                icon={AlertTriangle}
                color="purple"
                subValue="Son 3 ay ortalaması"
            />
        </div>
    );
};
