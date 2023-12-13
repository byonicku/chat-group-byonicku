import { useState } from "react";
import { auth } from "../../firebaseConfig";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Authentication() {
    const [user, setUser] = useState(null);

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
                setUser(user);
            }).catch((error) => {
                // Errors
                const errorCode = error.code;
                const errorMessage = error.message;
                // Email yang digunakan
                const email = error.email;
                // Auth credential
                const credential = GoogleAuthProvider.credentialFromError(error);
                // Error
                alert("Error GAuth\n", errorCode, errorMessage, email, credential);
            });
    }

    useEffect(() => {
        const userLocalStorage = localStorage.getItem("userfb");
        if (userLocalStorage) {
            const userLocalStorageObject = JSON.parse(userLocalStorage);
            setUser(userLocalStorageObject);
        }
    }, []);

    return (
        <div>
            <h1>Authentication</h1>
            {user ? (
                <div>
                    <img src={user.photoURL} alt={user.displayName} referrerPolicy="no-referrer" />
                    <p>Selamat datang, {user.displayName}</p>

                    <Link to="/ChatGroup" className="btn btn-primary">Go to Chat Group</Link>
                </div>
            ) : (
                <div>
                    <p>Anda belum login</p>
                    <button onClick={signInWithGoogle} className="btn btn-success">Sign in with Google</button>
                </div>
            )}
        </div>
    );
}