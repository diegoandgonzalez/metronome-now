import { Helmet, HelmetProvider } from "react-helmet-async";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import SnackbarContext from "./components/snackbar/snackbarContext"
import useSnackbar from "./components/snackbar/useSnackbar"
import Metronome from "./components/metronome"
import Snackbar from "./components/snackbar"
import appTheme from "./styles/theme";
import { useTranslation } from "react-i18next";

const App = () => {

  const snackbarValue = useSnackbar();
  const { t } = useTranslation();

  return (
    <HelmetProvider>
      <SnackbarContext value={snackbarValue}>
        <ThemeProvider theme={appTheme}>
          <Helmet>
            <meta name="description" content={t("meta.description")} />
            <meta property="og:description" content={t("meta.description")} />
            <meta property="og:title" content={"Metronome Now"} />
            <meta property="og:type" content="website" />
            <meta name="twitter:description" content={t("meta.description")} />
            <meta name="twitter:title" content={"Metronome Now"} />
            <meta name="twitter:card" content="summary" />
          </Helmet>
          <CssBaseline />
          <Metronome />
        </ThemeProvider>
        <Snackbar />
      </SnackbarContext>
    </HelmetProvider>
  )
}

export default App
