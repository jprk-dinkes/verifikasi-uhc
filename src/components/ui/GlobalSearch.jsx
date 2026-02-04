import { useState, useEffect, useRef } from 'react';
import { Search, X, User, FileText, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getMockPendaftaran } from '../../data/mockData';
import StatusBadge from './StatusBadge';
import './GlobalSearch.css';

export default function GlobalSearch({ onClose }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            return;
        }

        const data = getMockPendaftaran();
        const searchLower = query.toLowerCase();

        const filtered = data.filter(d =>
            d.nama_pasien?.toLowerCase().includes(searchLower) ||
            d.nik_pasien?.includes(query) ||
            d.no_reg_dinkes?.toLowerCase().includes(searchLower) ||
            d.no_bpjs?.includes(query) ||
            d.nama_kk?.toLowerCase().includes(searchLower) ||
            d.nik_kk?.includes(query)
        ).slice(0, 8);

        setResults(filtered);
        setSelectedIndex(0);
    }, [query]);

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter' && results[selectedIndex]) {
            handleSelect(results[selectedIndex]);
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    const handleSelect = (item) => {
        // Navigate based on status and user role
        if (item.status_id === 1) {
            const path = item.tipe_faskes === 'RS'
                ? '/dinkes/usulan-rs'
                : '/dinkes/usulan-pkm';
            navigate(path);
        } else if (item.status_id === 2) {
            navigate('/bpjs/verifikasi');
        } else {
            navigate('/dinkes/riwayat');
        }
        onClose();
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="global-search-overlay" onClick={onClose}>
            <div className="global-search-modal" onClick={e => e.stopPropagation()}>
                <div className="search-input-wrapper">
                    <Search className="search-icon" size={20} />
                    <input
                        ref={inputRef}
                        type="text"
                        className="search-input"
                        placeholder="Cari nama pasien, NIK, No. Reg, No. BPJS..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button className="search-close" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                {results.length > 0 ? (
                    <div className="search-results">
                        <div className="results-header">
                            <span>{results.length} hasil ditemukan</span>
                        </div>
                        {results.map((item, index) => (
                            <div
                                key={item.id}
                                className={`search-result-item ${index === selectedIndex ? 'selected' : ''}`}
                                onClick={() => handleSelect(item)}
                                onMouseEnter={() => setSelectedIndex(index)}
                            >
                                <div className="result-icon">
                                    <User size={16} />
                                </div>
                                <div className="result-content">
                                    <div className="result-main">
                                        <span className="result-name">{item.nama_pasien}</span>
                                        <StatusBadge statusId={item.status_id} size="sm" />
                                    </div>
                                    <div className="result-meta">
                                        <span>NIK: {item.nik_pasien}</span>
                                        {item.no_reg_dinkes && (
                                            <span>• No. Reg: {item.no_reg_dinkes}</span>
                                        )}
                                        <span>• {item.nama_faskes}</span>
                                    </div>
                                </div>
                                <ArrowRight className="result-arrow" size={16} />
                            </div>
                        ))}
                    </div>
                ) : query.length >= 2 ? (
                    <div className="search-empty">
                        <FileText size={40} />
                        <p>Tidak ada data ditemukan</p>
                        <span>Coba kata kunci lain</span>
                    </div>
                ) : (
                    <div className="search-hints">
                        <p>Tips pencarian:</p>
                        <ul>
                            <li><kbd>↑</kbd> <kbd>↓</kbd> navigasi hasil</li>
                            <li><kbd>Enter</kbd> buka detail</li>
                            <li><kbd>Esc</kbd> tutup</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
