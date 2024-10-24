import Body from "./Components/Body";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Transaction from "./Components/Transaction";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/udupi" element={<Body />} />
        <Route path="/transaction" element={<Transaction />} />
      </Routes>
    </Router>
  );
}

export default App;
