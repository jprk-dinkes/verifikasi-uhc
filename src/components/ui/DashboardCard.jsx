import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import './DashboardCard.css';

export default function DashboardCard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    trendValue,
    color = 'primary',
    className = ''
}) {
    const getTrendIcon = () => {
        if (trend === 'up') return <TrendingUp size={14} />;
        if (trend === 'down') return <TrendingDown size={14} />;
        return <Minus size={14} />;
    };

    const getTrendClass = () => {
        if (trend === 'up') return 'trend-up';
        if (trend === 'down') return 'trend-down';
        return 'trend-neutral';
    };

    return (
        <div className={`dashboard-card card-${color} ${className}`}>
            <div className="card-icon-wrapper">
                {Icon && <Icon className="card-icon" />}
            </div>

            <div className="card-content">
                <p className="card-title">{title}</p>
                <h3 className="card-value">{value}</h3>

                {(subtitle || trendValue) && (
                    <div className="card-footer">
                        {trendValue && (
                            <span className={`card-trend ${getTrendClass()}`}>
                                {getTrendIcon()}
                                {trendValue}
                            </span>
                        )}
                        {subtitle && <span className="card-subtitle">{subtitle}</span>}
                    </div>
                )}
            </div>
        </div>
    );
}
