// app/funds/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  CircularProgress,
  TextField,
  Pagination,
  Paper,
  Box,
  useTheme,
  InputAdornment,
  IconButton,
  Chip,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Skeleton,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FundCard from "@/components/FundCard";
import { Scheme } from "@/types/scheme";

export default function FundsPage() {
  const theme = useTheme();
  const [funds, setFunds] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [sortBy, setSortBy] = useState<string>("name");
  const [category, setCategory] = useState<string>("all");

  const limit = 50;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchFunds() {
      setLoading(true);
      try {
        const res = await fetch(`/api/mf?page=${page}&limit=${limit}`);
        const data = await res.json();
        setFunds(data.funds || []);
        setTotalPages(Math.ceil((data.total || 0) / limit));
      } catch (error) {
        console.error("Error fetching funds:", error);
        setFunds([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    }

    fetchFunds();
  }, [page]);

  const filteredFunds = funds
    .filter((fund) => {
      // Search filter
      const matchesSearch = fund.name?.toLowerCase().includes(search.toLowerCase());
      
      // Category filter
      const matchesCategory = category === 'all' || 
        fund.name?.toLowerCase().includes(category.toLowerCase());
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // Sorting logic
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'nameDesc':
          return (b.name || '').localeCompare(a.name || '');
        case 'code':
          return (a.code || '').localeCompare(b.code || '');
        default:
          return 0;
      }
    });

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!mounted) {
    return (
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Skeleton variant="text" width="40%" height={60} sx={{ mb: 3 }} />
        <Skeleton variant="rectangular" width="100%" height={60} sx={{ mb: 4, borderRadius: 2 }} />
        <Grid container spacing={3}>
          {[...Array(8)].map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      {/* Header Section */}
      <Box sx={{ mb: 5 }}>
        <Typography 
          variant="h3" 
          fontWeight={800} 
          gutterBottom 
          sx={{ 
            color: 'text.primary',
            mb: 1,
          }}
        >
          Mutual Fund Explorer
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Discover and track the best mutual funds for your investment goals
        </Typography>

        {/* Search and Filter Section */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            borderRadius: 3,
            bgcolor: 'background.paper',
            border: `1px solid ${theme.palette.divider}`,
            mb: 4,
          }}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
            {/* Enhanced Search Bar */}
            <TextField
              placeholder="Search funds by name..."
              variant="outlined"
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'primary.main' }} />
                  </InputAdornment>
                ),
                endAdornment: search && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setSearch("")}
                      edge="end"
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`,
                  },
                  '&.Mui-focused': {
                    boxShadow: `0 0 0 2px ${theme.palette.primary.main}40`,
                  },
                },
              }}
            />

            {/* Sort By Dropdown */}
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="name">Name (A-Z)</MenuItem>
                <MenuItem value="nameDesc">Name (Z-A)</MenuItem>
                <MenuItem value="code">Code</MenuItem>
              </Select>
            </FormControl>

            {/* Category Filter */}
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="equity">Equity</MenuItem>
                <MenuItem value="debt">Debt</MenuItem>
                <MenuItem value="hybrid">Hybrid</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          {/* Active Filters */}
          {(search || category !== 'all' || sortBy !== 'name') && (
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                Active filters:
              </Typography>
              {search && (
                <Chip
                  label={`Search: "${search}"`}
                  onDelete={() => setSearch("")}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
              {category !== 'all' && (
                <Chip
                  label={`Category: ${category}`}
                  onDelete={() => setCategory("all")}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
              {sortBy !== 'name' && (
                <Chip
                  label={`Sort: ${sortBy === 'nameDesc' ? 'Name (Z-A)' : 'Code'}`}
                  onDelete={() => setSortBy("name")}
                  size="small"
                  color="secondary"
                  variant="outlined"
                />
              )}
            </Box>
          )}
        </Paper>
      </Box>

      {loading ? (
        <Grid container spacing={3}>
          {[...Array(12)].map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
      ) : filteredFunds.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 8,
            textAlign: "center",
            backgroundColor: 'background.paper',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 3,
          }}
        >
          <Box sx={{ mb: 2 }}>
            <FilterListIcon sx={{ fontSize: 64, color: 'text.disabled', opacity: 0.3 }} />
          </Box>
          <Typography variant="h6" fontWeight={600} gutterBottom color="text.primary">
            No funds found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {search
              ? `No funds match "${search}". Try adjusting your search or filters.`
              : "No funds available at the moment."}
          </Typography>
        </Paper>
      ) : (
        <>
          {/* Results Count */}
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUpIcon sx={{ color: 'primary.main' }} />
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              Showing {filteredFunds.length} fund{filteredFunds.length !== 1 ? 's' : ''}
            </Typography>
          </Box>

          {/* Funds Grid */}
          <Grid container spacing={3}>
            {filteredFunds.map((fund) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={fund.code}>
                <FundCard fund={fund} />
              </Grid>
            ))}
          </Grid>

          {/* Enhanced Pagination */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
              sx={{
                "& .MuiPaginationItem-root": {
                  borderRadius: 2,
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
                  },
                  '&.Mui-selected': {
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    color: '#fff',
                    boxShadow: `0 4px 12px ${theme.palette.primary.main}60`,
                  },
                },
              }}
            />
          </Box>
        </>
      )}
    </Container>
  );
}