'use client'
import { Breakpoint, useMediaQuery, useTheme } from '@mui/material';

const useIsBelowBreakpoint = (breakpoint: Breakpoint) => {

  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down(breakpoint));
};

export default useIsBelowBreakpoint;