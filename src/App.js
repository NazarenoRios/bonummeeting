import { Routes, Route } from "react-router-dom";
import Meeting from "./pages/Meeting";

function App() {
  return (
    <Routes>
      <Route
        path="/meeting/:meetingId/:userRole/:userName/:userLastname/:userLanguage"
        element={<Meeting />}
      />
    </Routes>
  );
}

export default App;
