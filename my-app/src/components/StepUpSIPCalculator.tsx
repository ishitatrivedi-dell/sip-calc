'use client';

import { useState } from 'react';
import { TextField, Button, Typography, Box, Stack, Paper, Divider } from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function StepUpSIPCalculator({ code }: { code: string }) {
  const [initialSIP, setInitialSIP] = useState(1000);
  const [stepUpPercent, setStepUpPercent] = useState(10);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [tenureYears, setTenureYears] = useState(10);
  const [futureValue, setFutureValue] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [totalInvested, setTotalInvested] = useState(0);

  const calculateStepUpSIP = () => {
    let totalFV = 0;
    let currentSIP = initialSIP;
    let invested = 0;
    const monthlyRate = expectedReturn / 12 / 100;
    const data = [];
    const totalMonths = tenureYears * 12;

    let monthCounter = 0;
    
    for (let year = 1; year <= tenureYears; year++) {
      let yearlyInvestment = currentSIP * 12;
      invested += yearlyInvestment;
      
      // Calculate FV for this year's 12 monthly SIPs
      for (let month = 1; month <= 12; month++) {
        monthCounter++;
        // Remaining months from this SIP to the end
        const remainingMonths = totalMonths - monthCounter + 1;
        // Future value of this single SIP payment
        const sipFV = currentSIP * Math.pow(1 + monthlyRate, remainingMonths - 1);
        totalFV += sipFV;
      }
      
      data.push({
        year: `Y${year}`,
        sip: Math.round(currentSIP),
        invested: Math.round(invested),
      });
      
      // Step up for next year
      currentSIP *= (1 + stepUpPercent / 100);
    }

    setFutureValue(Math.round(totalFV));
    setTotalInvested(invested);
    setChartData(data);
  };

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

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#fff' }}>
          <TimelineIcon sx={{ color: '#10b981' }} />
          Step Up SIP Calculator
        </Typography>
        <Typography variant="body2" sx={{ color: '#8b92b0' }}>
          Calculate SIP returns with annual step-up increases
        </Typography>
      </Box>

      <Stack spacing={3}>
      <TextField label="Initial Monthly SIP" type="number" fullWidth value={initialSIP} onChange={(e) => setInitialSIP(Number(e.target.value))} sx={inputSx} />
      <TextField label="Step Up % (Annual)" type="number" fullWidth value={stepUpPercent} onChange={(e) => setStepUpPercent(Number(e.target.value))} sx={inputSx} />
      <TextField label="Expected Return (%)" type="number" fullWidth value={expectedReturn} onChange={(e) => setExpectedReturn(Number(e.target.value))} sx={inputSx} />
      <TextField label="Tenure (Years)" type="number" fullWidth value={tenureYears} onChange={(e) => setTenureYears(Number(e.target.value))} sx={inputSx} />
      <Button variant="contained" onClick={calculateStepUpSIP} sx={{ bgcolor: '#10b981', color: '#fff', py: 1.5, fontWeight: 600, '&:hover': { bgcolor: '#059669' } }}>Calculate</Button>
      {futureValue > 0 && (
        <>
          <Divider sx={{ my: 3, borderColor: '#1a2142' }} />
          
          {/* Results */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2, mb: 3 }}>
            <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#1a2142', borderRadius: 2, border: '1px solid #10b98140' }}>
              <Typography sx={{ color: '#8b92b0', fontSize: '0.875rem', mb: 0.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Total Invested
              </Typography>
              <Typography variant="h5" sx={{ color: '#06b6d4', fontWeight: 700 }}>
                ₹{totalInvested.toLocaleString()}
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
            
            <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#1a2142', borderRadius: 2, border: '1px solid #10b98140' }}>
              <Typography sx={{ color: '#8b92b0', fontSize: '0.875rem', mb: 0.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Total Gains
              </Typography>
              <Typography variant="h5" sx={{ color: '#8b5cf6', fontWeight: 700 }}>
                ₹{(futureValue - totalInvested).toLocaleString()}
              </Typography>
            </Paper>
          </Box>

          {/* Chart */}
          {chartData.length > 0 && (
            <Box>
              <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 2, color: '#fff' }}>
                Step-Up SIP Progression
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
                    <BarChart data={chartData}>
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
                      <Bar
                        dataKey="sip"
                        fill="#10b981"
                        name="Monthly SIP"
                        radius={[8, 8, 0, 0]}
                      />
                      <Bar
                        dataKey="invested"
                        fill="#8b5cf6"
                        name="Cumulative Investment"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
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