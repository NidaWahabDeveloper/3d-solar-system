import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; 
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx"; 
import "./index.css"; 

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* BrowserRouter must wrap everything that uses routing (<Routes>, <Link>, useNavigate, etc.) */}
    <BrowserRouter>
      {/* AuthProvider must wrap everything that needs to know "is someone logged in?" */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
