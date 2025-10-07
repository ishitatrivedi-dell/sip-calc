"use client";

import { TextField } from "@mui/material";

export default function SearchBar({ onSearch }: { onSearch: (q: string) => void }) {
  return (
    <TextField
      label="Search funds..."
      variant="outlined"
      fullWidth
      onChange={(e) => onSearch(e.target.value)}
      sx={{
        mb: 2,
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
  );
}
