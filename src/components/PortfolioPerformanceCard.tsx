import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for the chart
const data = [
  { time: '10 AM', value: 10000 },
  { time: '1 PM', value: 20000 },
  { time: '4 PM', value: 30000 },
  { time: '7 PM', value: 25000 },
  { time: '10 PM', value: 40000 },
  { time: '1 AM', value: 35000 },
  { time: '4 AM', value: 45000 },
  { time: '7 AM', value: 50000 },
  { time: '10 AM', value: 48000 },
];

const PortfolioPerformanceCardComponent: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = React.useState('1W');

  // Memoize static/mock data so the chart does not re-render when parent state changes
  const memoizedData = React.useMemo(() => data, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardContent sx={{ p: 3 }}>
          {/* Header */}
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}
          >
            <Box>
              <Typography variant="body2" color="text.secondary">
                Portfolio performance
              </Typography>
            </Box>

            {/* Period Filters */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              {['24H', '1W', '1M', '1Y', 'ALL'].map((period) => (
                <Box
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    cursor: 'pointer',
                    bgcolor: selectedPeriod === period ? '#000' : 'transparent',
                    color: selectedPeriod === period ? 'white' : 'text.secondary',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: selectedPeriod === period ? '#000' : 'action.hover',
                    },
                  }}
                >
                  {period}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Chart */}
          <Box sx={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={memoizedData}>
                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#999', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#999', fontSize: 12 }}
                  tickFormatter={(value: number) => `$${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#000',
                    border: 'none',
                    borderRadius: 8,
                    color: 'white',
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default React.memo(PortfolioPerformanceCardComponent);
