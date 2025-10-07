'use client';

import { useState } from 'react';
import { TextField, Button, Typography, Box, Stack, Paper, Divider } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function LumpSumCalculator({ code }: { code: string }) {
  const [lumpSum, setLumpSum] = useState(100000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [tenureYears, setTenureYears] = useState(10);
  const [futureValue, setFutureValue] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);

  const calculateLumpSum = () => {
    const annualRate = expectedReturn / 100;
    const fv = lumpSum * Math.pow(1 + annualRate, tenureYears);
    setFutureValue(fv);

    // Generate chart data
    const data = [];
    for (let year = 0; year <= tenureYears; year++) {
      const value = lumpSum * Math.pow(1 + annualRate, year);
      data.push({
        year: `Year ${year}`,
        value: Math.round(value),
      });
    }
    setChartData(data);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#fff' }}>
          <AccountBalanceIcon sx={{ color: '#10b981' }} />
          Lump Sum Calculator
        </Typography>
        <Typography variant="body2" sx={{ color: '#8b92b0' }}>
          Calculate returns on your one-time investment
        </Typography>
      </Box>

      <Stack spacing={3}>
      <TextField 
        label="Lump Sum Amount" 
        type="number" 
        fullWidth
        value={lumpSum} 
        onChange={(e) => setLumpSum(Number(e.target.value))}
        sx={{
          '& .MuiOutlinedInput-root': {
            color: '#fff',
            bgcolor: '#1a2142',
            '& fieldset': { borderColor: '#1a2142' },
            '&:hover fieldset': { borderColor: '#10b981' },
            '&.Mui-focused fieldset': { borderColor: '#10b981' },
          },
          '& .MuiInputLabel-root': { color: '#8b92b0' },
          '& .MuiInputLabel-root.Mui-focused': { color: '#10b981' },
        }}
      />
      <TextField 
        label="Expected Return (%)" 
        type="number" 
        fullWidth
        value={expectedReturn} 
        onChange={(e) => setExpectedReturn(Number(e.target.value))}
        sx={{
          '& .MuiOutlinedInput-root': {
            color: '#fff',
            bgcolor: '#1a2142',
            '& fieldset': { borderColor: '#1a2142' },
            '&:hover fieldset': { borderColor: '#10b981' },
            '&.Mui-focused fieldset': { borderColor: '#10b981' },
          },
          '& .MuiInputLabel-root': { color: '#8b92b0' },
          '& .MuiInputLabel-root.Mui-focused': { color: '#10b981' },
        }}
      />
      <TextField 
        label="Tenure (Years)" 
        type="number" 
        fullWidth
        value={tenureYears} 
        onChange={(e) => setTenureYears(Number(e.target.value))}
        sx={{
          '& .MuiOutlinedInput-root': {
            color: '#fff',
            bgcolor: '#1a2142',
            '& fieldset': { borderColor: '#1a2142' },
            '&:hover fieldset': { borderColor: '#10b981' },
            '&.Mui-focused fieldset': { borderColor: '#10b981' },
          },
          '& .MuiInputLabel-root': { color: '#8b92b0' },
          '& .MuiInputLabel-root.Mui-focused': { color: '#10b981' },
        }}
      />
      <Button 
        variant="contained" 
        onClick={calculateLumpSum}
        sx={{
          bgcolor: '#10b981',
          color: '#fff',
          py: 1.5,
          fontWeight: 600,
          '&:hover': { bgcolor: '#059669' },
        }}
      >
        Calculate
      </Button>
      {futureValue > 0 && (
        <>
          <Divider sx={{ my: 3, borderColor: '#1a2142' }} />
          
          {/* Results */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, mb: 3 }}>
            <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#1a2142', borderRadius: 2, border: '1px solid #10b98140' }}>
              <Typography sx={{ color: '#8b92b0', fontSize: '0.875rem', mb: 0.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Initial Investment
              </Typography>
              <Typography variant="h5" sx={{ color: '#06b6d4', fontWeight: 700 }}>
                ₹{lumpSum.toLocaleString()}
              </Typography>
            </Paper>
            
            <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#1a2142', borderRadius: 2, border: '1px solid #10b98140' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <TrendingUpIcon sx={{ fontSize: 16, color: '#10b981' }} />
                <Typography sx={{ color: '#8b92b0', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Future Value
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ color: '#10b981', fontWeight: 700 }}>
                ₹{futureValue.toLocaleString()}
              </Typography>
            </Paper>
          </Box>

          {/* Profit Card */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #10b98115 0%, #10b98108 100%)',
              border: '1px solid #10b98130',
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="body2" sx={{ color: '#8b92b0', fontWeight: 500 }}>
                  Total Profit
                </Typography>
                <Typography variant="h4" fontWeight={800} sx={{ color: '#10b981' }}>
                  ₹{(futureValue - lumpSum).toLocaleString()}
                </Typography>
              </Box>
              <TrendingUpIcon sx={{ fontSize: 60, opacity: 0.15, color: '#10b981' }} />
            </Stack>
          </Paper>

          {/* Chart */}
          {chartData.length > 0 && (
            <Box>
              <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 2, color: '#fff' }}>
                Growth Over Time
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  border: '1px solid #1a2142',
                  backgroundColor: '#0f1535',
                }}
              >
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorLumpSum" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1a2142" />
                      <XAxis 
                        dataKey="year" 
                        tick={{ fontSize: 12, fill: '#8b92b0' }}
                        stroke="#1a2142"
                      />
                      <YAxis 
                        tickFormatter={(val) =>
                          val >= 1e7
                            ? `₹${(val / 1e7).toFixed(1)}Cr`
                            : val >= 1e5
                            ? `₹${(val / 1e5).toFixed(1)}L`
                            : val >= 1000
                            ? `₹${(val / 1000).toFixed(0)}k`
                            : `₹${val.toFixed(0)}`
                        }
                        tick={{ fontSize: 11, fill: '#8b92b0' }}
                        width={90}
                        domain={['dataMin', 'dataMax']}
                        stroke="#1a2142"
                        allowDataOverflow={false}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0f1535', 
                          border: '1px solid #1a2142',
                          borderRadius: 8,
                        }}
                        labelStyle={{ color: '#fff' }}
                        formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Value']}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#10b981"
                        strokeWidth={3}
                        fill="url(#colorLumpSum)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Box>
          )}
        </>
      )}
      </Stack>
    </Box>
  );
}