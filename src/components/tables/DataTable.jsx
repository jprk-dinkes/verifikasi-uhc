import { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search, Filter, ChevronDown, CheckSquare, Square, MinusSquare } from 'lucide-react';
import './DataTable.css';

export default function DataTable({
    data = [],
    columns = [],
    pageSize = 10,
    searchable = true,
    searchPlaceholder = 'Cari...',
    filters = [],
    onRowClick,
    emptyMessage = 'Tidak ada data',
    actions,
    selection = false,
    onSelectionChange
}) {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilters, setActiveFilters] = useState({});
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [showFilters, setShowFilters] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);

    // Reset selection when data changes significantly or filters change
    useEffect(() => {
        setSelectedIds([]);
        if (onSelectionChange) onSelectionChange([]);
    }, [activeFilters, searchTerm, onSelectionChange]);

    // Filter and search data
    const filteredData = useMemo(() => {
        let result = [...data];

        // Apply search
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(item =>
                columns.some(col => {
                    const value = item[col.key];
                    return value && String(value).toLowerCase().includes(term);
                })
            );
        }

        // Apply filters
        Object.entries(activeFilters).forEach(([key, value]) => {
            if (value && value !== 'all') {
                result = result.filter(item => String(item[key]) === String(value));
            }
        });

        // Apply sorting
        if (sortConfig.key) {
            result.sort((a, b) => {
                const aVal = a[sortConfig.key];
                const bVal = b[sortConfig.key];

                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [data, searchTerm, activeFilters, sortConfig, columns]);

    // Pagination
    const totalPages = Math.ceil(filteredData.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleFilterChange = (key, value) => {
        setActiveFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setActiveFilters({});
        setSearchTerm('');
        setCurrentPage(1);
    };

    // Selection Handlers
    const handleSelectAll = () => {
        if (selectedIds.length === paginatedData.length && paginatedData.length > 0) {
            setSelectedIds([]); // Deselect all
            if (onSelectionChange) onSelectionChange([]);
        } else {
            const ids = paginatedData.map(row => row.id);
            setSelectedIds(ids);
            if (onSelectionChange) onSelectionChange(ids);
        }
    };

    const handleSelectRow = (id) => {
        let newSelected;
        if (selectedIds.includes(id)) {
            newSelected = selectedIds.filter(itemId => itemId !== id);
        } else {
            newSelected = [...selectedIds, id];
        }
        setSelectedIds(newSelected);
        if (onSelectionChange) onSelectionChange(newSelected);
    };

    const isAllSelected = paginatedData.length > 0 && selectedIds.length === paginatedData.length;
    const isIndeterminate = selectedIds.length > 0 && selectedIds.length < paginatedData.length;

    return (
        <div className="data-table-container">
            {/* Toolbar */}
            <div className="table-toolbar">
                {searchable && (
                    <div className="search-wrapper">
                        <Search className="search-icon" size={18} />
                        <input
                            type="text"
                            className="search-input"
                            placeholder={searchPlaceholder}
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                )}

                {filters.length > 0 && (
                    <button
                        className={`btn btn-outline filter-toggle ${showFilters ? 'active' : ''}`}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter size={16} />
                        Filter
                        <ChevronDown size={14} className={showFilters ? 'rotate' : ''} />
                    </button>
                )}

                {/* Bulk Action Indicator */}
                {selection && selectedIds.length > 0 && (
                    <div className="selection-stats animate-fade-in">
                        <span className="count-badge">{selectedIds.length} dipilih</span>
                    </div>
                )}

                {actions && <div className="table-actions">{actions}</div>}
            </div>

            {/* Filters */}
            {showFilters && filters.length > 0 && (
                <div className="filters-panel animate-fade-in">
                    {filters.map(filter => (
                        <div key={filter.key} className="filter-item">
                            <label className="filter-label">{filter.label}</label>
                            <select
                                className="form-select filter-select"
                                value={activeFilters[filter.key] || 'all'}
                                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                            >
                                <option value="all">Semua</option>
                                {filter.options.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    ))}

                    <button className="btn btn-sm btn-secondary" onClick={clearFilters}>
                        Reset Filter
                    </button>
                </div>
            )}

            {/* Table */}
            <div className="table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            {selection && (
                                <th className="selection-cell">
                                    <div
                                        className="checkbox-wrapper"
                                        onClick={handleSelectAll}
                                    >
                                        {isAllSelected ? <CheckSquare size={18} className="text-primary" /> :
                                            isIndeterminate ? <MinusSquare size={18} className="text-primary" /> :
                                                <Square size={18} className="text-muted" />}
                                    </div>
                                </th>
                            )}
                            {columns.map(col => (
                                <th
                                    key={col.key}
                                    className={col.sortable ? 'sortable' : ''}
                                    onClick={() => col.sortable && handleSort(col.key)}
                                    style={{ width: col.width }}
                                >
                                    <span className="th-content">
                                        {col.label}
                                        {col.sortable && sortConfig.key === col.key && (
                                            <span className="sort-indicator">
                                                {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + (selection ? 1 : 0)} className="empty-row">
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((row, index) => (
                                <tr
                                    key={row.id || index}
                                    onClick={(e) => {
                                        // Avoid row click if clicking checkbox or action button
                                        if (e.target.closest('.checkbox-wrapper') || e.target.closest('button') || e.target.closest('.action-cell')) return;
                                        if (onRowClick) onRowClick(row);
                                    }}
                                    className={`${onRowClick ? 'clickable' : ''} ${selectedIds.includes(row.id) ? 'selected-row' : ''}`}
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    {selection && (
                                        <td className="selection-cell">
                                            <div
                                                className="checkbox-wrapper"
                                                onClick={() => handleSelectRow(row.id)}
                                            >
                                                {selectedIds.includes(row.id) ?
                                                    <CheckSquare size={18} className="text-primary" /> :
                                                    <Square size={18} className="text-muted" />}
                                            </div>
                                        </td>
                                    )}
                                    {columns.map(col => (
                                        <td key={col.key}>
                                            {col.render ? col.render(row[col.key], row) : row[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="table-pagination">
                    <span className="pagination-info">
                        Showing {startIndex + 1}-{Math.min(startIndex + pageSize, filteredData.length)} of {filteredData.length}
                    </span>

                    <div className="pagination-controls">
                        <button
                            className="btn btn-icon btn-outline"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft size={18} />
                        </button>

                        <div className="page-numbers">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                                        onClick={() => setCurrentPage(pageNum)}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            className="btn btn-icon btn-outline"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
