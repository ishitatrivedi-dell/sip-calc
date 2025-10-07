'use client';

import { useState } from 'react';
import { TextField, Button, Typography, Box, Stack, Paper, Divider } from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';

interface StepUpSWPResult {
  remainingCorpus: number;
  totalWithdrawn: number;
}

const inputSx = {
  '& .MuiOutlinedInput-root': {
    color: '#fff',
    bgcolor: '#1a2142',
    '& fieldset': { borderColor: '#1a2142' },
    '&:hover fieldset': { borderColor: '#10b981' },
    '&.Mui-focused fieldset': { borderColor: '#10b981' },
  },
  '& .MuiInputLabel-root': { color: '#8b92b0' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#10b981' },
};

export default function StepUpSWPCalculator({ code }: { code: string }) {
  const [lumpSum, setLumpSum] = useState(100000);
  const [initialWithdrawal, setInitialWithdrawal] = useState(1000);
  const [stepUpPercent, setStepUpPercent] = useState(10);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [tenureYears, setTenureYears] = useState(10);
  const [result, setResult] = useState<StepUpSWPResult | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  const calculateStepUpSWP = () => {
    let corpus = lumpSum;
    let totalWithdrawn = 0;
    let currentWithdrawal = initialWithdrawal;
    const monthlyRate = expectedReturn / 12 / 100;
    const data = [];

    // Store initial state
    data.push({
      year: `Y0`,
      corpus: Math.round(corpus),
      withdrawn: 0,
      withdrawal: 0,
    });

    for (let year = 1; year <= tenureYears; year++) {
      for (let month = 1; month <= 12; month++) {
        // Withdraw at the beginning of the month
        corpus -= currentWithdrawal;
        totalWithdrawn += currentWithdrawal;
        
        if (corpus < 0) {
          corpus = 0;
          break;
        }
        
        // Then grow the remaining corpus
        corpus *= (1 + monthlyRate);
      }
      
      data.push({
        year: `Y${year}`,
        corpus: Math.round(Math.max(0, corpus)),
        withdrawn: Math.round(totalWithdrawn),
        withdrawal: Math.round(currentWithdrawal),
      });
      
      // Step up withdrawal for next year
      currentWithdrawal *= (1 + stepUpPercent / 100);
      
      if (corpus <= 0) break;
    }

    setResult({ remainingCorpus: Math.max(0, corpus), totalWithdrawn });
    setChartData(data);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#fff' }}>
          <CalculateIcon sx={{ color: '#10b981' }} />
          Step Up SWP Calculator
        </Typography>
        <Typography variant="body2" sx={{ color: '#8b92b0' }}>
          Calculate SWP with annual withdrawal increases
        </Typography>
      </Box>

      <Stack spacing={3}>
      <TextField label="Lump Sum" type="number" fullWidth value={lumpSum} onChange={(e) => setLumpSum(Number(e.target.value))} sx={inputSx} />
      <TextField label="Initial Monthly Withdrawal" type="number" fullWidth value={initialWithdrawal} onChange={(e) => setInitialWithdrawal(Number(e.target.value))} sx={inputSx} />
      <TextField label="Step Up % (Annual)" type="number" fullWidth value={stepUpPercent} onChange={(e) => setStepUpPercent(Number(e.target.value))} sx={inputSx} />
      <TextField label="Expected Return (%)" type="number" fullWidth value={expectedReturn} onChange={(e) => setExpectedReturn(Number(e.target.value))} sx={inputSx} />
      <TextField label="Tenure (Years)" type="number" fullWidth value={tenureYears} onChange={(e) => setTenureYears(Number(e.target.value))} sx={inputSx} />
      <Button variant="contained" onClick={calculateStepUpSWP} sx={{ bgcolor: '#10b981', color: '#fff', py: 1.5, fontWeight: 600, '&:hover': { bgcolor: '#059669' } }}>Calculate</Button>
      {result && (
        <>
          <Divider sx={{ my: 3, borderColor: '#1a2142' }} />
          
          {/* Results */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, mb: 3 }}>
            <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#1a2142', borderRadius: 2, border: '1px solid #10b98140' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <TrendingDownIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
                <Typography sx={{ color: '#8b92b0', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Total Withdrawn
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ color: '#f59e0b', fontWeight: 700 }}>
                ₹{result.totalWithdrawn.toLocaleString()}
              </Typography>
            </Paper>
            
            <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#1a2142', borderRadius: 2, border: '1px solid #10b98140' }}>
              <Typography sx={{ color: '#8b92b0', fontSize: '0.875rem', mb: 0.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Remaining Corpus
              </Typography>
              <Typography variant="h5" sx={{ color: '#10b981', fontWeight: 700 }}>
                ₹{result.remainingCorpus.toLocaleString()}
              </Typography>
            </Paper>
          </Box>

          {/* Chart */}
          {chartData.length > 0 && (
            <Box>
              <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 2, color: '#fff' }}>
                Step-Up Withdrawal Pattern
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
                        <linearGradient id="colorCorpus" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorWithdrawn" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
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
                        formatter={(value: any) => `₹${value.toLocaleString()}`}
                      />
                      <Legend 
                        wrapperStyle={{ color: '#8b92b0' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="corpus"
                        stroke="#10b981"
                        strokeWidth={3}
                        fill="url(#colorCorpus)"
                        name="Remaining Corpus"
                      />
                      <Area
                        type="monotone"
                        dataKey="withdrawn"
                        stroke="#f59e0b"
                        strokeWidth={3}
                        fill="url(#colorWithdrawn)"
                        name="Total Withdrawn"
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