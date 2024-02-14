


import InitialScreen from './pages/init/initial_screen';
import {Route, Routes, MemoryRouter as Router} from 'react-router-dom';
import ProjectHome from './pages/project/home';


function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" exact element={ <InitialScreen /> } />  */}
        <Route path="/" exact element={ <ProjectHome /> } /> 
      </Routes>
    </Router>
  );
}

export default App;
