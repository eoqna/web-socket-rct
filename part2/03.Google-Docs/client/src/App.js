import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import EditorContainer from "./containers/editorContainer/EditorContainer";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route 
          path="/"
          element={<Navigate replace to={`/documents/${uuidV4()}`} />}
        />
        <Route path="/documents/:id" element={<EditorContainer />} />
      </Routes>
    </Router>
  );
}

export default App;
