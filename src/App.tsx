import LanguageChanger from "./components/languageChanger"
import ThemeChanger from "./components/themeChanger"
import Metronome from "./components/metronome"
import Title from "./components/metronome/components/title"

const App = () => {

  return (
    <>
      <header className="header">
        <Title />
        <div>
          <LanguageChanger />
          <ThemeChanger />
        </div>
      </header>
      <Metronome />
    </>
  )
}

export default App
