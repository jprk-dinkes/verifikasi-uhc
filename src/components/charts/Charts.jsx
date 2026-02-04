import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import './Charts.css';

const COLORS = ['#2563EB', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

export function TrendChart({ data, title, dataKey = 'value', xKey = 'name' }) {
    return (
        <div className="chart-container">
            {title && <h4 className="chart-title">{title}</h4>}
            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis
                        dataKey={xKey}
                        stroke="var(--text-muted)"
                        fontSize={12}
                        tickLine={false}
                    />
                    <YAxis
                        stroke="var(--text-muted)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            fontSize: '12px'
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey={dataKey}
                        stroke="var(--primary)"
                        strokeWidth={2}
                        dot={{ fill: 'var(--primary)', strokeWidth: 2 }}
                        activeDot={{ r: 6, fill: 'var(--primary)' }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export function BarChartComponent({ data, title, bars = [{ dataKey: 'value', color: 'var(--primary)' }], xKey = 'name' }) {
    return (
        <div className="chart-container">
            {title && <h4 className="chart-title">{title}</h4>}
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis
                        dataKey={xKey}
                        stroke="var(--text-muted)"
                        fontSize={12}
                        tickLine={false}
                    />
                    <YAxis
                        stroke="var(--text-muted)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            fontSize: '12px'
                        }}
                    />
                    <Legend />
                    {bars.map((bar, index) => (
                        <Bar
                            key={bar.dataKey}
                            dataKey={bar.dataKey}
                            fill={bar.color || COLORS[index]}
                            radius={[4, 4, 0, 0]}
                            name={bar.name || bar.dataKey}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export function PieChartComponent({ data, title, dataKey = 'value', nameKey = 'name' }) {
    return (
        <div className="chart-container">
            {title && <h4 className="chart-title">{title}</h4>}
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey={dataKey}
                        nameKey={nameKey}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={40}
                        paddingAngle={2}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.color || COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            fontSize: '12px'
                        }}
                    />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
