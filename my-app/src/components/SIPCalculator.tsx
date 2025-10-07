// components/SIPCalculator.tsx
"use client";

import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Stack,
  Divider,
  Box,
  useTheme,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import { formatCurrency, formatPercent } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import PercentIcon from '@mui/icons-material/Percent';

// Custom Tooltip with enhanced styling
const CustomTooltip = ({ active, payload, label, theme }: any) => {
  const isDark = theme.palette.mode === 'dark';
  if (active && payload && payload.length) {
    return (
      <Paper
        elevation={3}
        sx={{
          p: 2,
          minWidth: 180,
          bgcolor: isDark ? '#000000' : '#ffffff',
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block', fontWeight: 600 }}>
          {label}
        </Typography>
        <Typography variant="h6" fontWeight={700} sx={{ color: 'primary.main' }}>
          {formatCurrency(payload[0].value)}
        </Typography>
      </Paper>
    );
  }
  return null;
};

export default function SIPCalculator({ code }: { code: string }) {
  const [amount, setAmount] = useState<number>(5000);
  const [from, setFrom] = useState<string>("2020-01-01");
  const [to, setTo] = useState<string>("2023-12-31");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleCalculate = async () => {
    if (!amount || !from || !to) return;
    
    // Validation
    if (amount < 100) {
      setError("Minimum SIP amount should be ₹100");
      return;
    }
    if (new Date(from) >= new Date(to)) {
      setError("End date must be after start date");
      return;
    }
    
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/scheme/${code}/sip`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, frequency: "monthly", from, to }),
      });
      
      if (!res.ok) {
        throw new Error("Failed to calculate SIP returns");
      }
      
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("SIP calculation error:", error);
      setError("Unable to calculate returns. Please try again.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  // Theme-aware input styles
  const inputSx = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: isDark ? '#0a0a0a' : 'rgba(0, 200, 150, 0.03)',
      color: 'text.primary',
      '&:hover': {
        backgroundColor: isDark ? '#0a0a0a' : 'rgba(0, 200, 150, 0.05)',
      },
    },
    '& .MuiInputLabel-root': {
      color: 'text.secondary',
    },
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
          <ShowChartIcon sx={{ color: 'primary.main' }} />
          SIP Calculator
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Calculate your systematic investment plan returns over time
        </Typography>
      </Box>

      {/* Input Section */}
      <Stack spacing={3} sx={{ mb: 4 }}>
        <TextField
          label="Monthly SIP Amount"
          type="number"
          fullWidth
          value={amount || ""}
          onChange={(e) => setAmount(e.target.value ? parseInt(e.target.value) : 0)}
          slotProps={{
            input: {
              startAdornment: (
                <Box sx={{ mr: 1.5, color: 'text.secondary', fontWeight: 700, fontSize: '1.1rem' }}>
                  ₹
                </Box>
              ),
            },
          }}
          InputLabelProps={{ shrink: true }}
          sx={inputSx}
        />

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Start Date"
            type="date"
            fullWidth
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={inputSx}
          />
          <TextField
            label="End Date"
            type="date"
            fullWidth
            value={to}
            onChange={(e) => setTo(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={inputSx}
          />
        </Stack>

        {error && (
          <Alert severity="error" onClose={() => setError("")} sx={{ borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={handleCalculate}
          disabled={loading || !amount || !from || !to}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <TrendingUpIcon />}
          sx={{ 
            py: 1.8, 
            fontWeight: 700, 
            fontSize: "1rem",
            borderRadius: 2.5,
            textTransform: 'none',
            bgcolor: 'primary.main',
            color: '#fff',
            boxShadow: 2,
            '&:hover': {
              bgcolor: 'primary.dark',
              boxShadow: 4,
            },
          }}
        >
          {loading ? "Calculating..." : "Calculate SIP Returns"}
        </Button>
      </Stack>

      {/* Results Section */}
      {result && (
        <>
          <Divider sx={{ my: 4 }} />

          {/* Metrics Grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: 2.5,
              mb: 4,
            }}
          >
            <MetricItem
              label="Total Invested"
              value={formatCurrency(result.totalInvested)}
              color="info"
              icon={<AccountBalanceWalletIcon />}
            />
            <MetricItem
              label="Current Value"
              value={formatCurrency(result.currentValue)}
              color="success"
              icon={<TrendingUpIcon />}
            />
            <MetricItem
              label="Absolute Return"
              value={formatPercent(result.absoluteReturn)}
              color="primary"
              icon={<ShowChartIcon />}
            />
            <MetricItem
              label="Annualized Return"
              value={formatPercent(result.annualizedReturn)}
              color="secondary"
              icon={<PercentIcon />}
            />
          </Box>

          {/* Profit/Loss Card */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 3,
              background: result.currentValue > result.totalInvested
                ? `linear-gradient(135deg, ${theme.palette.success.light}15 0%, ${theme.palette.success.main}08 100%)`
                : `linear-gradient(135deg, ${theme.palette.error.light}15 0%, ${theme.palette.error.main}08 100%)`,
              border: `1px solid ${result.currentValue > result.totalInvested ? theme.palette.success.main : theme.palette.error.main}30`,
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  {result.currentValue > result.totalInvested ? 'Total Profit' : 'Total Loss'}
                </Typography>
                <Typography variant="h4" fontWeight={800} color={result.currentValue > result.totalInvested ? 'success.main' : 'error.main'}>
                  {formatCurrency(Math.abs(result.currentValue - result.totalInvested))}
                </Typography>
              </Box>
              <TrendingUpIcon sx={{ fontSize: 60, opacity: 0.15, color: result.currentValue > result.totalInvested ? 'success.main' : 'error.main' }} />
            </Stack>
          </Paper>

          {/* Chart */}
          {result.growthOverTime?.length > 0 && (
            <Box>
              <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 2, color: 'text.primary' }}>
                Growth Over Time
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  backgroundColor: isDark ? '#000000' : '#fafafa',
                }}
              >
                <Box sx={{ height: { xs: 300, sm: 350, md: 400 } }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={result.growthOverTime}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
                        tickMargin={10}
                        angle={-35}
                        textAnchor="end"
                        height={80}
                        interval={Math.max(1, Math.floor(result.growthOverTime.length / 8))}
                        stroke={theme.palette.divider}
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
                        tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
                        width={90}
                        domain={['dataMin', 'dataMax']}
                        stroke={theme.palette.divider}
                        allowDataOverflow={false}
                      />
                      <Tooltip content={<CustomTooltip theme={theme} />} />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke={theme.palette.primary.main}
                        strokeWidth={3}
                        fill="url(#colorValue)"
                        activeDot={{ r: 7, fill: theme.palette.primary.main }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

// Enhanced Metric Item with icons
function MetricItem({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: string;
  color: "primary" | "secondary" | "success" | "info";
  icon: React.ReactNode;
}) {
  const colorMap = {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    success: '#10b981',
    info: '#06b6d4',
  };
  
  const mainColor = colorMap[color];
  
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 3,
        background: `linear-gradient(135deg, ${mainColor}15 0%, ${mainColor}05 100%)`,
        border: `1px solid ${mainColor}40`,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
          border: `1px solid ${mainColor}60`,
        },
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1, 
          mb: 1.5,
          color: mainColor,
        }}>
          {icon}
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 0.5, color: '#8b92b0' }}
          >
            {label}
          </Typography>
        </Box>
        <Typography
          variant="h5"
          fontWeight={800}
          sx={{
            color: mainColor,
            lineHeight: 1.2,
          }}
        >
          {value}
        </Typography>
      </Box>
      
      {/* Decorative background element */}
      <Box
        sx={{
          position: 'absolute',
          right: -10,
          bottom: -10,
          opacity: 0.04,
          fontSize: '5rem',
          color: mainColor,
        }}
      >
        {icon}
      </Box>
    </Paper>
  );
}