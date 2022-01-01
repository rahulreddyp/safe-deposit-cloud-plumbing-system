import { useEffect, useState } from "react";
import axios from "axios";
import Lex from "../Lex/Lex"
import HomePage from "../HomePage/HomePage";

function DisplayMessages() {
  const [messages, setMessages] = useState("");

  useEffect(() => {
    async function Display() {
      if (localStorage.getItem("boxID")) {
        axios
          .get(
            " https://us-central1-gold-cocoa-316817.cloudfunctions.net/getmessages/messages/" +
            localStorage.getItem("boxID")
          )
          .then((response) => {
            if (response.data.status === 200) {
            }
                 setMessages(response.data.message);
          });
      }
    }
    Display();
  },[]);

  return (
    <div>

    <HomePage></HomePage>
      <h1 style = {{fontSize: "20", paddingLeft: 20, paddingTop: 20}}> Messages</h1>
      <h3 style = {{fontSize: "15", paddingLeft: 20,paddingTop: 20 }}>{messages}</h3>
      <Lex></Lex>
    </div>
  );
}

export default DisplayMessages;