'use client'
import { Backdrop, CircularProgress } from '@mui/material';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';

const Spinner = () => {

  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  if (!isFetching && !isMutating) return null;

  return (
    <Backdrop open sx={{ zIndex: 9999 }}>
      <CircularProgress />
    </Backdrop>
  )
}

export default Spinner;