import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    color: 'blue' | 'green' | 'purple' | 'orange';
    loading?: boolean;
}

const colorMap = {
    blue: {
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        iconBg: 'bg-blue-100',
    },
    green: {
        bg: 'bg-green-50',
        text: 'text-green-600',
        iconBg: 'bg-green-100',
    },
    purple: {
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        iconBg: 'bg-purple-100',
    },
    orange: {
        bg: 'bg-orange-50',
        text: 'text-orange-600',
        iconBg: 'bg-orange-100',
    },
};

const StatsCard = ({ title, value, icon: Icon, color, loading = false }: StatsCardProps) => {
    const { text, iconBg } = colorMap[color];

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                    <p className={`text-3xl font-bold ${loading ? 'text-gray-300' : 'text-gray-800'}`}>
                        {loading ? '...' : value}
                    </p>
                </div>
                <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${text}`} />
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
