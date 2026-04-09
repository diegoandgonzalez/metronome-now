import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import SnackbarContext from "./components/snackbar/snackbarContext"
import useSnackbar from "./components/snackbar/useSnackbar"
import Metronome from "./components/metronome"
import Snackbar from "./components/snackbar"
import appTheme from "./styles/theme";

const App = () => {

  const snackbarValue = useSnackbar();

  return (
      <SnackbarContext value={snackbarValue}>
        <ThemeProvider theme={appTheme}>
          <CssBaseline />
          <Metronome />
        </ThemeProvider>
        <Snackbar />
      </SnackbarContext>
  )
}

export default App
