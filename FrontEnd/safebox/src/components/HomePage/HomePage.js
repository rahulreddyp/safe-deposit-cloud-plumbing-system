import { useState, useEffect} from "react";
import axios from "axios";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Lex from "../Lex/Lex";
import { useNavigate } from 'react-router-dom';

function HomePage() {  
    const navigate = useNavigate();
  const [user, setUser] = useState(false);  
  useEffect(() => {
    async function loadUserdetails() {
      if (localStorage.getItem("userID")) {
        setUser(true);  
        await axios
          .post("https://ufr6ng63j0.execute-api.us-east-1.amazonaws.com/serverlessproject/userdetails", {
            userId: localStorage.getItem("userID"),
            boxId: localStorage.getItem("boxID")
          })
          .then((response) => {
          });   
      }
    }
    loadUserdetails();
  }, []);
    function handleLogout(event){
        event.preventDefault();
        localStorage.clear();
        navigate("/");
    }
  return(
    <Box sx={{ flexGrow: 1 }} >
    <AppBar position="static" style = {{backgroundColor : "black"}}>
    <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          SafeDeposit
        </Typography>
        <Button color="inherit" href = "/">Home</Button>
        {!user && (
            <div>
        <Button color="inherit" href = "/register">Register</Button>
        <Button color="inherit" href = "/LoginPage">Login</Button>
        </div>
        )}
        {user && (
            <div>
                <Button color="inherit" href = "/messages">Notifications</Button>
                <Button color="inherit" href = "/fileupload">Send Image</Button>
                <Button color="inherit" onClick= {handleLogout}>logout</Button>
        </div>
        )}
      </Toolbar>
    </AppBar>
    <Lex></Lex>
  </Box>
  
  )
}

export default HomePage;