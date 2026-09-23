import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function BalanceChart({ data = [] }) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="bal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366F1" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={false} width={54} />
          <Tooltip
            formatter={(value, name) => [
              `$${Number(value).toFixed(2)}`,
              name === 'income' ? 'Income' : name === 'expense' ? 'Expense' : 'Balance',
            ]}
            contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }}
          />
          <Area type="monotone" dataKey="income" stroke="#10B981" fill="transparent" strokeWidth={2} />
          <Area type="monotone" dataKey="expense" stroke="#F43F5E" fill="transparent" strokeWidth={2} />
          <Area type="monotone" dataKey="balance" stroke="#6366F1" fill="url(#bal)" strokeWidth={2.5} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
