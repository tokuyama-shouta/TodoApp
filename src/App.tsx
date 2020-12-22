import React, {useState, useEffect} from 'react';
import './App.css';
import { db } from "./firebase"
import { FormControl, TextField } from "@material-ui/core";
import AddToPhotoSIcon from "@material-ui/icons/AddToPhotos"

const App: React.FC = () => {
  const [tasks, setTasks] = useState([{id: "" ,title: "" }]);
  const [input, setInput] = useState("");
  useEffect(() => {
    const unSub = db.collection("tasks").onSnapshot((snapshot) => {
      setTasks(
        snapshot.docs.map((doc) => ({id: doc.id, title: doc.data().title}))
      );
    });
    return () => unSub();
  },[]);

  const newTask = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    db.collection("tasks").add({title: input});
    setInput("");
  }

  return (
    <div className="App">
      <h1>ToDo App React Firebase</h1>
      <FormControl>
        <TextField 
          InputLabelProps={{
            shrink: true,
          }}
          label="New task ?" 
          value={input} 
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
          setInput(e.target.value)}
        />
      </FormControl>
      <button disabled={!input} onClick={newTask}>
        <AddToPhotoSIcon/>
      </button>
      {tasks.map((task) => (<h3 key={task.id}>{task.title}</h3>))}
    </div>
  );
}

export default App;
