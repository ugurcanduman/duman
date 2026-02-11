import clsx from 'clsx';

export const Card = ({ children, className, title }) => (
    <div className={clsx("bg-white rounded-2xl p-6 border border-gray-100 shadow-sm", className)}>
        {title && <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>}
        {children}
    </div>
);
