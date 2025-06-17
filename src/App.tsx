import SnackbarContext from "./components/snackbar/snackbarContext"
import useSnackbar from "./components/snackbar/useSnackbar"
import Metronome from "./components/metronome"
import Snackbar from "./components/snackbar"

const App = () => {

  const snackbarValue = useSnackbar();

  return (
    <SnackbarContext value={snackbarValue}>
      <Metronome />
      <Snackbar />
    </SnackbarContext>
  )
}

export default App
