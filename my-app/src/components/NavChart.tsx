// components/NavChart.tsx
"use client";

import { Box, Typography, useTheme } from "@mui/material";
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { LineChart } from "@mui/x-charts/LineChart";

export default function NavChart({ data }: { data: { date: string; nav: number }[] }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography 
          variant="h6" 
          fontWeight={700} 
          gutterBottom 
          sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}
        >
          <ShowChartIcon sx={{ color: 'primary.main' }} />
          NAV History
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Net Asset Value trends over time
        </Typography>
      </Box>
      
      <Box
        sx={{
          '& .MuiChartsAxis-line': {
            stroke: theme.palette.divider,
          },
          '& .MuiChartsAxis-tick': {
            stroke: theme.palette.divider,
          },
          '& .MuiChartsAxis-tickLabel': {
            fill: theme.palette.text.secondary,
            fontSize: '0.75rem',
          },
          '& .MuiChartsLegend-series text': {
            fill: theme.palette.text.primary,
            fontWeight: 600,
          },
        }}
      >
        <LineChart
          xAxis={[{ 
            data: data.map((d) => d.date), 
            scaleType: "point",
            tickLabelStyle: {
              angle: -45,
              textAnchor: 'end',
              fontSize: 11,
            },
          }]}
          series={[{ 
            data: data.map((d) => d.nav), 
            label: "NAV",
            color: theme.palette.primary.main,
            curve: "monotoneX",
            showMark: false,
          }]}
          width={600}
          height={350}
          margin={{ left: 60, right: 20, top: 20, bottom: 70 }}
          grid={{ vertical: true, horizontal: true }}
          sx={{
            '& .MuiLineElement-root': {
              strokeWidth: 2.5,
            },
          }}
        />
      </Box>
    </Box>
  );
}