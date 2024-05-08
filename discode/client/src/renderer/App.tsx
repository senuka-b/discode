import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import "tailwindcss/tailwind.css";
import InitialScreen from './pages/init/initial_screen';
import ProjectHome from './pages/project/home';
import Console from './pages/console/console';



export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={ <InitialScreen /> } />
        <Route path="/project" element={ <ProjectHome /> } />
        <Route path="/console"  element={ <Console /> } />
      </Routes>
    </Router>
  );
}
