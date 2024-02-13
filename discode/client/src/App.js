


import InitialScreen from './pages/init/initial_screen';
import {Route, Routes, MemoryRouter as Router} from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={ <InitialScreen /> } /> 
      </Routes>
    </Router>
  );
}

export default App;
