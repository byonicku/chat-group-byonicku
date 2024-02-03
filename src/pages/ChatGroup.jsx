import { useEffect, useState } from "react";
import { db, DB_KEY } from "../../firebaseConfig";
import { ref, onValue, set, off } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import {
  faPencil,
  faTrash,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";

import "./ChatGroup.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Card,
  CardBody,
  Container,
  Form,
  Row,
  Stack,
} from "react-bootstrap";

export default function ChatGroup(props) {
  const [list, setList] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Get user dari localStorage
    const userLocalStorage = localStorage.getItem("userfb");
    if (!userLocalStorage) {
      navigate("/");
    } else {
      const userLocalStorageObject = JSON.parse(userLocalStorage);
      setUser(userLocalStorageObject);

      const dataRef = ref(db, DB_KEY);

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
  }, [props, navigate]);

  const addItem = (e) => {
    e.preventDefault();

    if (input === "") return;

    // newData adalah data yang akan diupdate ke database
    const newData = list || [];

    // Tambahkan item baru ke newData
    const chat = input;

    setInput("");
    if (chat) {
      const newItem = {
        id: Date.now(),
        chat: chat,
        user: {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        },
      }; // Replace this with your actual item
      newData.push(newItem);
      console.log(chat);
      // Update the data in the database
      const dataRef = ref(db, DB_KEY);
      set(dataRef, newData);
    }

    e.target.reset();
    e.target.blur();
  };

  const deleteItem = (id) => {
    const newData = list || [];

    // Hapus item dengan id tertentu dari newData
    const index = newData.findIndex((item) => item.id === id);
    if (index !== -1) {
      newData.splice(index, 1);
    }

    // Update the data in the database
    const dataRef = ref(db, DB_KEY);
    set(dataRef, newData);
  };

  const updateItem = (id) => {
    const newData = list || [];

    // Update item dengan id tertentu dari newData
    const index = newData.findIndex((item) => item.id === id);
    if (index !== -1) {
      const chat = prompt("Enter your new message :", newData[index].todo);

      if (chat.trim()) {
        newData[index].chat = chat;
      }
    }

    newData[index].edited = true;
    newData[index].id = Date.now();

    // Update the data in the database
    const dataRef = ref(db, DB_KEY);
    set(dataRef, newData);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.shiftKey) {
      setInput((prev) => prev + "\\n");
    }

    if (e.key === "Enter" && e.shiftKey == false) {
      e.preventDefault();
      e.stopPropagation();
      e.target.form.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  };

  return (
    <div>
      {loading ? (
        <Container className="d-flex flex-column align-items-center text-center my-5">
          <TailSpin color="#00BFFF" />
        </Container>
      ) : (
        <>
          <Card className="border-0">
            <CardBody>
              <ul className="chatGroup">
                {list.length > 0 ? (
                  list.map((item) => (
                    <li
                      key={item.id}
                      className={
                        item.user.uid === user.uid ? "sent" : "received"
                      }
                    >
                      {item.user.uid === user.uid && (
                        <>
                          <Row className="text-start">
                            <div className="col-md-12 pb-1">
                              <Button
                                variant="success"
                                onClick={() => updateItem(item.id)}
                              >
                                <FontAwesomeIcon icon={faPencil} width={15} />
                              </Button>
                            </div>
                            <div className="col-md-12">
                              <button
                                className="btn btn-danger"
                                onClick={() => deleteItem(item.id)}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                          </Row>
                        </>
                      )}
                      <div className="chatGroup-user">
                        {item.user.uid !== user.uid && (
                          <div>
                            <img
                              src={item.user.photoURL}
                              alt={item.user.displayName}
                              className="chatGroup-user-img"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}

                        <div className="chatGroup-user-field">
                          <p className="chatGroup-user-name">
                            {item.user.displayName}
                          </p>
                          <div
                            className="container px-0"
                            style={{
                              maxWidth: "20vw",
                              wordWrap: "break-word",
                            }}
                          >
                            <p className="chatGroup-user-text">{item.chat}</p>
                          </div>

                          <p className="chatGroup-user-time">
                            {new Date(item.id).toLocaleDateString()}{" "}
                            {new Date(item.id).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          <p className="chatGroup-user-time">
                            {item.edited && "(edited)"}
                          </p>
                        </div>
                        {item.user.uid === user.uid && (
                          <img
                            src={item.user.photoURL}
                            alt={item.user.displayName}
                            className="chatGroup-user-img"
                            referrerPolicy="no-referrer"
                          />
                        )}
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="chatGroup-empty">Belum ada chat :(</p>
                )}
              </ul>
              <footer>
                <form onSubmit={addItem}>
                  <div className="py-2 px-3">
                    <Stack
                      direction="horizontal"
                      gap={2}
                      className="d-flex align-items-center"
                    >
                      <Form.Control
                        id="chatGroup-input"
                        type="text"
                        as={"textarea"}
                        placeholder="Enter your message"
                        onKeyDown={handleKeyDown}
                        onChange={(e) => setInput(e.target.value)}
                        style={{ resize: "none" }}
                      />

                      <Button type="submit" variant="light">
                        <FontAwesomeIcon
                          icon={faPaperPlane}
                          type="submit"
                          size="lg"
                        />
                      </Button>
                    </Stack>
                  </div>
                </form>
              </footer>
            </CardBody>
          </Card>
        </>
      )}
    </div>
  );
}
