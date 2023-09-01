import { Routes, Route } from "react-router-dom";
import Meeting from "./pages/Meeting";

function App() {
  return (
    <Routes>
      <Route path="/meeting/:meetingId" element={<Meeting />} />
    </Routes>
  );
}

export default App;
