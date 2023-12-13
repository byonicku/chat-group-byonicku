import { useEffect, useState } from "react";
import { db, DB_TODO_KEY } from "../../firebaseConfig";
import { ref, onValue, set, off } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { FidgetSpinner } from "react-loader-spinner";
import {
  faDoorOpen,
  faPencil,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

import "./ChatGroup.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function TodoList() {
  const [list, setList] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    // Get user dari localStorage

    const userLocalStorage = localStorage.getItem("userfb");
    if (!userLocalStorage) {
      navigate("/");
    } else {
      const userLocalStorageObject = JSON.parse(userLocalStorage);
      setUser(userLocalStorageObject);

      // Get data dari database dengan key=DB_TODO_KEY
      const dataRef = ref(db, DB_TODO_KEY);

      // Ketika ada perubahan data, maka akan mengambil data dari database
      const onDataChange = (snapshot) => {
        setLoading(false);
        const newData = snapshot.val();
        if (!Array.isArray(newData)) {
          setList([]);
        } else {
          setList(newData);
        }
      };

      onValue(dataRef, onDataChange);

      return () => {
        // Ketika halaman ditutup, maka akan menghapus listener
        off(dataRef, onDataChange);
      };
    }
  }, []);

  const addItem = (e) => {
    e.preventDefault();
    if (e.target[0].value.trim() === "") {
        return;
    }
    // newDAta adalah data yang akan diupdate ke database
    const newData = list || [];

    // Tambahkan item baru ke newData
    const isiTodo = e.target[0].value;
    document.querySelector("input").value = "";
    if (isiTodo.trim()) {
      const newItem = {
        id: Date.now(),
        todo: isiTodo,
        user: {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        },
      }; // Replace this with your actual item
      newData.push(newItem);

      // Update the data in the database
      const dataRef = ref(db, DB_TODO_KEY);
      set(dataRef, newData);
    }
  };

  const deleteItem = (id) => {
    const newData = list || [];

    // Hapus item dengan id tertentu dari newData
    const index = newData.findIndex((item) => item.id === id);
    if (index !== -1) {
      newData.splice(index, 1);
    }

    // Update the data in the database
    const dataRef = ref(db, DB_TODO_KEY);
    set(dataRef, newData);
  };

  const updateItem = (id) => {
    const newData = list || [];

    // Update item dengan id tertentu dari newData
    const index = newData.findIndex((item) => item.id === id);
    if (index !== -1) {
      const isiTodo = prompt("Enter your new message :", newData[index].todo);
      if (isiTodo.trim()) {
        newData[index].todo = isiTodo;
      }
    }
    newData[index].edited = true;
    newData[index].id = Date.now();
    // Update the data in the database
    const dataRef = ref(db, DB_TODO_KEY);
    set(dataRef, newData);
  };

  const logout = () => {
    localStorage.removeItem("userfb");
    localStorage.removeItem("tokenfb");
    navigate("/");
  };

  return (
    <div>
      {loading ? (
        <FidgetSpinner />
      ) : (
        <>
          <div className="card">
            <div className="card-title">
              <h1>Chat Group 9 / 11</h1>
              <button onClick={() => logout()} className="btn btn-danger">
                <FontAwesomeIcon icon={faDoorOpen} /> Logout
              </button>
            </div>
            <div className="card-body">
              <ul className="chatGroup">
                {list.length > 0 ? (
                  list.map((item) => (
                    <li key={item.id} className={item.user.uid === user.uid ? 'sent' : 'received'}>
                        {item.user.uid === user.uid && (
                          <>
                            <div className="row text-start">
                                <div className="col-md-12 pb-1">
                                    <button
                                    className="btn btn-success"
                                    onClick={() => updateItem(item.id)}
                                    >
                                    <FontAwesomeIcon icon={faPencil} width={15}/>
                                    </button>
                                </div>
                                <div className="col-md-12">
                                    <button
                                    className="btn btn-danger"
                                    onClick={() => deleteItem(item.id)}
                                    >
                                    <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            </div>
                          </>
                        )}
                      <div className="chatGroup-user">
                        {
                            item.user.uid !== user.uid && (
                                <div>
                                    <img
                                    src={item.user.photoURL}
                                    alt={item.user.displayName}
                                    className="chatGroup-user-img"
                                    referrerPolicy="no-referrer"
                                    />
                                </div>
                            )
                        }
                        
                        <div className="chatGroup-user-field">
                          <p className="chatGroup-user-name">
                            {item.user.displayName}
                          </p>
                          <div className="container px-0" style={{ 
                            maxWidth: "20vw",
                            wordWrap: "break-word",
                           }}>
                             <p className="chatGroup-user-text">
                            {item.todo}
                            </p>
                          </div>
                          
                          <p className="chatGroup-user-time">
                            {new Date(item.id).toLocaleDateString()} {new Date(item.id).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', })}
                          </p>
                          <p className="chatGroup-user-time">
                            {item.edited && "(edited)"}
                          </p>
                        </div>
                        {
                            item.user.uid === user.uid && (
                                <img
                                src={item.user.photoURL}
                                alt={item.user.displayName}
                                className="chatGroup-user-img"
                                referrerPolicy="no-referrer"
                                />
                            )
                        }
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="chatGroup-empty">Belum ada chat :(</p>
                )}
              </ul>
              <form onSubmit={addItem}>
                <div className="row">
                  <div className="col-md-10">
                    <input
                      type="text"
                      placeholder="Enter your message"
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-2 ps-0">
                    <button type="submit" className="btn btn-primary">
                      Send
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}