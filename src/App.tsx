import React, {useState, useEffect} from 'react';
import styles from "./App.module.css"
import { db } from "./firebase"
import { FormControl, TextField,List } from "@material-ui/core";
import AddToPhotoSIcon from "@material-ui/icons/AddToPhotos"
import TaskItem from './TaskItem';
import { makeStyles } from "@material-ui/styles"
import { auth } from "./firebase"
import ExitToAppIcon from "@material-ui/icons/ExitToApp"

const useStyles = makeStyles({
  field: {
    marginTop: 30,
    marginBottom: 20,
  },
  list: {
    margin: "auto",
    width: "40%",
  }
})

const App: React.FC = (props:any) => {
  const [tasks, setTasks] = useState([{id: "" ,title: "" }]);
  const [input, setInput] = useState("");
  const classes = useStyles();

  useEffect(() => {
    const unSub = auth.onAuthStateChanged((user) => {
      !user && props.history.push("login")
    });
    return () => unSub();
  })
 

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
    <div className={styles.app__root}>
      <h1>ToDo App React Firebase</h1>
      <button 
        className={styles.app__logout}
        onClick={
          async () => {
            try{await auth.signOut();
              props.history.push("/");
            }catch(error) {
              alert(error.message);
            }
          }
        }
      >
        <ExitToAppIcon/>
      </button>
      <br/>
      <FormControl>
        <TextField 
          className={classes.field}
          InputLabelProps={{
            shrink: true,
          }}
          label="New task ?" 
          value={input} 
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
          setInput(e.target.value)}
        />
      </FormControl>
      <button disabled={!input} onClick={newTask} className={styles.app__icon}>
        <AddToPhotoSIcon/>
      </button>
      <List className={classes.list}>
        {tasks.map((task) => (<TaskItem key={task.id} id={task.id} title={task.title}/>))}
      </List>
    </div>
  );
}

export default App;
