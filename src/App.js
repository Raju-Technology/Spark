import {Routes,Route} from "react-router-dom"
import Home from "./Pages/Home"
import Scan from "./Pages/Scan";

function App() {
  return (
    <div>
        <Routes>
            <Route exact path="" element={<Home />}/>
            <Route exact path="/scan" element={<Scan />}/>
        </Routes>
    </div>
  );
}

export default App;
