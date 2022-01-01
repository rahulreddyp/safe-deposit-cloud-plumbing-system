import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage";
import LoginPage from './components/profileManagement/LoginPage';
import RegistrationPage from './components/profileManagement/registrationPage';
import DisplayMessages from "./components/PubSub/Messages";
import FileUpload from './components/MachineLearning/FileUpload';
import Visualize from './components/Visualization/Visualization';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<HomePage/>} />
          <Route exact path="/LoginPage" element={<LoginPage/>} />
          <Route exact path='/register' element={<RegistrationPage/>} />
          <Route exact path="/messages" element={<DisplayMessages/>} />
          <Route path="/fileUpload" exact component={FileUpload} />
          <Route path="/visualization" exact component={Visualize} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;