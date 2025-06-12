import LanguageChanger from "./components/languageChanger"
import ThemeChanger from "./components/themeChanger"
import Metronome from "./components/metronome"

const App = () => {

  return (
    <>
      <div className="fixedButtonsContainer">
        <LanguageChanger />
        <ThemeChanger />
      </div>
      <Metronome />
    </>
  )
}

export default App
