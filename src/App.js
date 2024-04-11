import Status from "./Context/Status";
import HomePage from "./HomePage.jsx"

function App() {
  return (
    <div className="App">
      <Status Compoment={<HomePage/>}></Status>
    </div>
  );
}

export default App;