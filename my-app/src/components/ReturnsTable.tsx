// // components/ReturnsTable.tsx
// "use client";

// import { useEffect, useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   CircularProgress,
//   Box,
//   Typography,
// } from "@mui/material";
// import { formatPercent } from "@/lib/utils";

// type ReturnData = {
//   simpleReturn: number;
//   annualizedReturn?: number;
// };

// const PERIODS = ["1m", "3m", "6m", "1y"] as const;

// export default function ReturnsTable({ code }: { code: string }) {
//   const [returnsMap, setReturnsMap] = useState<Record<string, ReturnData | null>>({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!code) return;

//     const fetchReturnForPeriod = async (period: string): Promise<[string, ReturnData | null]> => {
//       try {
//         const res = await fetch(`/api/scheme/${code}/returns?period=${period}`);
//         if (!res.ok) {
//           console.warn(`Failed to fetch returns for period ${period}:`, res.status);
//           return [period, null];
//         }
//         const data = await res.json();
//         // Ensure the response has expected fields
//         return [period, { 
//           simpleReturn: data.simpleReturn ?? 0,
//           annualizedReturn: data.annualizedReturn 
//         }];
//       } catch (err) {
//         console.error(`Error fetching returns for ${period}:`, err);
//         return [period, null];
//       }
//     };

//     const fetchAll = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const results = await Promise.all(
//           PERIODS.map(period => fetchReturnForPeriod(period))
//         );
//         const resultMap = Object.fromEntries(results);
//         setReturnsMap(resultMap);
//       } catch (err) {
//         setError("Failed to load returns data.");
//         console.error("Unexpected error in fetchAll:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAll();
//   }, [code]);

//   if (loading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
//         <CircularProgress size={24} />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Typography color="error" variant="body2">
//         {error}
//       </Typography>
//     );
//   }

//   return (
//     <Table size="small">
//       <TableHead>
//         <TableRow>
//           <TableCell sx={{ fontWeight: "600" }}>Period</TableCell>
//           <TableCell align="right" sx={{ fontWeight: "600" }}>
//             Simple Return
//           </TableCell>
//           <TableCell align="right" sx={{ fontWeight: "600" }}>
//             Annualized
//           </TableCell>
//         </TableRow>
//       </TableHead>
//       <TableBody>
//         {PERIODS.map((period) => {
//           const data = returnsMap[period];
//           return (
//             <TableRow key={period}>
//               <TableCell>{period.toUpperCase()}</TableCell>
//               <TableCell align="right">
//                 {data ? formatPercent(data.simpleReturn) : "-"}
//               </TableCell>
//               <TableCell align="right">
//                 {data && data.annualizedReturn !== undefined
//                   ? formatPercent(data.annualizedReturn)
//                   : "-"}
//               </TableCell>
//             </TableRow>
//           );
//         })}
//       </TableBody>
//     </Table>
//   );
// }


// components/ReturnsTable.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Box,
  Typography,
  Paper,
  useTheme,
  Chip,
  TableContainer,
  Skeleton,
} from "@mui/material";
import { formatPercent } from "@/lib/utils";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AssessmentIcon from '@mui/icons-material/Assessment';

type ReturnData = {
  simpleReturn: number;
  annualizedReturn?: number;
};

const PERIODS = ["1m", "3m", "6m", "1y", "3y", "5y"] as const;

const PERIOD_LABELS: Record<string, string> = {
  "1m": "1 Month",
  "3m": "3 Months",
  "6m": "6 Months",
  "1y": "1 Year",
  "3y": "3 Years",
  "5y": "5 Years",
};

export default function ReturnsTable({ code }: { code: string }) {
  const [returnsMap, setReturnsMap] = useState<Record<string, ReturnData | null>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!code) return;

    const fetchReturnForPeriod = async (period: string): Promise<[string, ReturnData | null]> => {
      try {
        const res = await fetch(`/api/scheme/${code}/returns?period=${period}`);
        if (!res.ok) {
          console.warn(`Failed to fetch returns for period ${period}:`, res.status);
          return [period, null];
        }
        const data = await res.json();
        return [period, { 
          simpleReturn: data.simpleReturn ?? 0,
          annualizedReturn: data.annualizedReturn 
        }];
      } catch (err) {
        console.error(`Error fetching returns for ${period}:`, err);
        return [period, null];
      }
    };

    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const results = await Promise.all(
          PERIODS.map(period => fetchReturnForPeriod(period))
        );
        const resultMap = Object.fromEntries(results);
        setReturnsMap(resultMap);
      } catch (err) {
        setError("Failed to load returns data.");
        console.error("Unexpected error in fetchAll:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [code]);

  const ReturnCell = ({ value }: { value: number | undefined | null }) => {
    if (value === undefined || value === null) return <span style={{ color: theme.palette.text.secondary }}>-</span>;
    
    const isPositive = value >= 0;
    const positiveColor = theme.palette.mode === 'dark' ? '#10b981' : '#059669';
    const negativeColor = theme.palette.mode === 'dark' ? '#ef4444' : '#dc2626';
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end' }}>
        {isPositive ? (
          <TrendingUpIcon sx={{ fontSize: 16, color: positiveColor }} />
        ) : (
          <TrendingDownIcon sx={{ fontSize: 16, color: negativeColor }} />
        )}
        <Typography
          variant="body2"
          fontWeight={600}
          sx={{
            color: isPositive ? positiveColor : negativeColor,
          }}
        >
          {formatPercent(value)}
        </Typography>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
        <CircularProgress size={24} sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography sx={{ color: theme.palette.mode === 'dark' ? '#ef4444' : '#dc2626' }} variant="body2">
        {error}
      </Typography>
    );
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: theme.palette.mode === 'dark' ? '#1a2142' : '#f3f4f6' }}>
            <TableCell 
              sx={{ 
                fontWeight: 700,
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                color: 'text.secondary',
                py: 2,
                borderColor: theme.palette.divider,
              }}
            >
              Period
            </TableCell>
            <TableCell 
              align="right" 
              sx={{ 
                fontWeight: 700,
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                color: 'text.secondary',
                py: 2,
                borderColor: theme.palette.divider,
              }}
            >
              Simple Return
            </TableCell>
            <TableCell 
              align="right" 
              sx={{ 
                fontWeight: 700,
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                color: 'text.secondary',
                py: 2,
                borderColor: theme.palette.divider,
              }}
            >
              Annualized
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {PERIODS.map((period) => {
            const data = returnsMap[period];
            return (
              <TableRow 
                key={period}
                sx={{
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' ? '#1a2142' : '#f9fafb',
                  },
                  '&:last-child td': {
                    borderBottom: 0,
                  },
                }}
              >
                <TableCell sx={{ py: 2.5, borderColor: theme.palette.divider }}>
                  <Chip
                    label={PERIOD_LABELS[period]}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      backgroundColor: theme.palette.mode === 'dark' ? '#10b98120' : '#10b98130',
                      color: 'primary.main',
                      border: `1px solid ${theme.palette.mode === 'dark' ? '#10b98140' : '#10b98160'}`,
                    }}
                  />
                </TableCell>
                <TableCell align="right" sx={{ py: 2.5, borderColor: theme.palette.divider }}>
                  <ReturnCell value={data?.simpleReturn} />
                </TableCell>
                <TableCell align="right" sx={{ py: 2.5, borderColor: theme.palette.divider }}>
                  <ReturnCell value={data?.annualizedReturn} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}