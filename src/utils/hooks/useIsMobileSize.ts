import { useMediaQuery, useTheme } from "@mui/material";

const useIsMobileSize = () => {

  const theme = useTheme();
  const isMobileSize = useMediaQuery(theme.breakpoints.down("md"));

  return isMobileSize;
};

export default useIsMobileSize;