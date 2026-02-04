import { STATUS } from '../../data/mockData';
import { Clock, CheckCircle, Pause, XCircle, Check, AlertCircle } from 'lucide-react';
import './StatusBadge.css';

export default function StatusBadge({ statusId, size = 'md' }) {
    const status = STATUS[statusId];

    if (!status) {
        return <span className="badge badge-secondary">Unknown</span>;
    }

    const getIcon = () => {
        switch (status.icon) {
            case 'clock': return <Clock size={size === 'sm' ? 10 : 12} />;
            case 'check': return <Check size={size === 'sm' ? 10 : 12} />;
            case 'check-circle': return <CheckCircle size={size === 'sm' ? 10 : 12} />;
            case 'pause': return <Pause size={size === 'sm' ? 10 : 12} />;
            case 'x': return <XCircle size={size === 'sm' ? 10 : 12} />;
            default: return <AlertCircle size={size === 'sm' ? 10 : 12} />;
        }
    };

    return (
        <span className={`status-badge status-${status.color} size-${size}`}>
            {getIcon()}
            <span>{status.label}</span>
        </span>
    );
}
