import { BrowserRouter, Route, Routes } from "react-router-dom";
import ChatGroup from "./pages/ChatGroup";
import LandingPage from "./pages/LandingPage";
import Header from "./component/Header.jsx";

import { auth } from "../firebaseConfig";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useEffect, useState } from "react";
import About from "./pages/About.jsx";
import { toast, Toaster } from "sonner";

function App() {
  const [user, setUser] = useState(null);

  // TODO Pisah ini
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // Mendapatkan Google Access Token
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // Mendapatkan user yang login
        const user = result.user;
        // Set user ke localStorage
        localStorage.setItem("userfb", JSON.stringify(user));
        localStorage.setItem("tokenfb", JSON.stringify(token));
        // Set user ke state

        toast.success("Login Success!");
        setUser(user);
      })
      .catch((error) => {
        // Errors
        const errorCode = error.code;
        const errorMessage = error.message;
        // Email yang digunakan
        const email = error.email;
        toast.error("Error occured!");
        // Auth credential
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(errorCode, errorMessage, email, credential);
      });
  };

  const logout = () => {
    localStorage.removeItem("userfb");
    localStorage.removeItem("tokenfb");
    setUser(null);
    toast.success("Logout Success!");
  };

  useEffect(() => {
    const userLocalStorage = localStorage.getItem("userfb");
    if (userLocalStorage) {
      const userLocalStorageObject = JSON.parse(userLocalStorage);
      setUser(userLocalStorageObject);
    }
  }, []);

  return (
    <>
      <Toaster position="top-center" richColors closeButton />
      <BrowserRouter>
        <Header
          user={user}
          signInWithGoogle={signInWithGoogle}
          logout={logout}
        />
        <Routes>
          <Route path="/" element={<LandingPage user={user} />} />
          <Route path="/chat" element={<ChatGroup user={user} />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
