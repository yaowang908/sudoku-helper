import React, { useState } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import { Box } from '@mui/system';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import {
  setHideCrossedValues,
  getHideCrossedValues,
} from '@/store/sudokuSlice';

const ToggleCrossedValues = () => {
  const hideCrossedValues = useAppSelector(getHideCrossedValues);
  const dispatch = useAppDispatch();

  const handleChange = () => {
    dispatch(setHideCrossedValues(!hideCrossedValues));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <Checkbox
        inputProps={{ 'aria-label': 'Hide crossed values' }}
        checked={hideCrossedValues}
        onChange={handleChange}
      />
      <Typography>Hide crossed values</Typography>
    </Box>
  );
};

export default ToggleCrossedValues;
