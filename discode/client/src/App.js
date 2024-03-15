


import InitialScreen from './pages/init/initial_screen';
import {Route, Routes, MemoryRouter as Router} from 'react-router-dom';
import ProjectHome from './pages/project/home';
import MyFlowComponent from './pages/test';
import YourApp from './pages/test';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={ <InitialScreen /> } /> 
        <Route path="/project" exact element={ <ProjectHome /> } /> 
      </Routes>
    </Router>
  );
}

export default App;
