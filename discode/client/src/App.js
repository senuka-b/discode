


import InitialScreen from './pages/init/initial_screen';
import {Route, Routes, HashRouter as Router} from 'react-router-dom';
import ProjectHome from './pages/project/home';
import MyFlowComponent from './pages/test';
import YourApp from './pages/test';
import Console from './pages/console/console';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={ <InitialScreen /> } /> 
        <Route path="/project" exact element={ <ProjectHome /> } /> 
        <Route path="/console" exact element={ <Console /> } /> 
      </Routes>
    </Router>
  );
}

export default App;
