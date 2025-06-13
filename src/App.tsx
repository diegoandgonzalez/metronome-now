import LanguageChanger from "./components/languageChanger"
import ThemeChanger from "./components/themeChanger"
import Metronome from "./components/metronome"
import Title from "./components/metronome/components/title"
import SnackbarContext from "./components/snackbar/snackbarContext"
import useSnackbar from "./components/snackbar/useSnackbar"
import Snackbar from "./components/snackbar"

const App = () => {

  const snackbarValue = useSnackbar();

  return (
    <SnackbarContext
      value={{...snackbarValue}}
    >
      <header className="header">
        <Title />
        <div>
          <Snackbar />
          <LanguageChanger />
          <ThemeChanger />
        </div>
      </header>
      <Metronome />
    </SnackbarContext>
  )
}

export default App
