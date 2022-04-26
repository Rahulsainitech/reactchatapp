import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { Card, Spinner, Form, Image } from "react-bootstrap";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import { getSender, getSenderFull } from "../config/Chatlogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import ScrollableChat from "../components/ScrollableChat";
import axios from "axios";
import Swal from "sweetalert2";
import io from "socket.io-client";
import music from "./chat_sound.mp3";
import { BsEmojiSmile } from "react-icons/bs";
import { MdSend } from "react-icons/md";
const ENDPOINT = "https://chatify-chatter.herokuapp.com/";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat,notification,setNotification } = ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnnected, setSocketConnected] = useState();
  const [showemoji, setShowemoji] = useState(false);
  const [typing,setTyping]=useState(false);
  const [isTyping,setIsTyping]=useState(false);
 
  

  var audio = new Audio(music);
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
    socket.on("typing",()=>setIsTyping(true));
    socket.on("stop typing",()=>setIsTyping(false))
  }, []);

  const addEmoji = (e) => {
    let message=newMessage;
    message+=e.native
    setNewMessage(message);
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if(!socketConnnected) return;
    if(!typing){
      setTyping(true)
      socket.emit("typing",selectedChat._id);
    }
    let lastTypingTime = new Date().getTime()
    var timerLength = 3000;
    setTimeout(()=>{
      var timeNow = new Date().getTime();
      var timeDiff = timeNow-lastTypingTime
      if (timeDiff>= timerLength && typing){
        socket.emit("stop typing",selectedChat._id);
        setTyping(false)
      }
    },timerLength)
  
  };
  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      console.log("message", messages);
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    console.log(notification,"000")
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        //give notification
        if(!notification.includes(newMessageRecieved.chat._id)){
          setNotification([newMessageRecieved,...notification])
          setFetchAgain(!fetchAgain)
          console.log(notification,"---------------")
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
        audio.play();
      }
    });
  }, [messages]);

  const keyDownHandler = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };
  const sendMessage = async (e) => {
    setShowemoji(false);
    if (newMessage) {
      socket.emit("stop typing",selectedChat._id)
      try {
        
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        // console.log("rahul", data);
        setMessages([...messages, data]);
        socket.emit("new message", data);
      } catch (error) {
        Swal.fire({
          icon: "warning",
          title: "failed to send the message",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
  };

  return (
    <>
      {selectedChat ? (
        <div style={{ height: "90vh" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 15px",
              background: "#B6E0E0",
            }}
          >
            <AiOutlineArrowLeft
              className="d-md-none"
              style={{ fontSize: "2rem" }}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  fetchMessages={fetchMessages}
                  setFetchAgain={setFetchAgain}
                />
              </>
            )}
          </div>
          {loading ? (
            <Spinner animation="grow" variant="danger" />
          ) : (
            <div className="messages" onClick={() => setShowemoji(false)}>
              <ScrollableChat messages={messages} />
            </div>
          )}
          <div
            style={{
              position: "absolute",
              bottom: "0",
              right: "0",
              left: "0",
            }}
          >
            {showemoji && (
              <span>
                <Picker onSelect={addEmoji} />
              </span>
            )}
            {isTyping? <div><iframe src="https://embed.lottiefiles.com/animation/77160" style={{width:"100px",height:"100px"}}></iframe></div>:<></>}
            <div style={{ display: "flex" }}>
              <BsEmojiSmile
                onClick={() => setShowemoji(showemoji ? false : true)}
                style={{
                  marginTop: "5px",
                  cursor: "pointer",
                  fontSize: "1.6rem",
                }}
              />
                         
              <Form.Control
                onKeyDown={keyDownHandler}
                style={{ border: "none" }}
                type="text"
                placeholder="Enter your message here..."
                onChange={typingHandler}
                value={newMessage}
                required
              />
              <MdSend
                style={{
                  marginTop: "5px",
                  cursor: "pointer",
                  fontSize: "2rem",
                  color: "white",
                  backgroundColor:"green",
                  borderRadius: "50%",
                  padding:"7px"
                }}
                onClick={sendMessage}
              />
            </div>
          </div>
        </div>
      ) : (
        <Card
          className=" d-none d-md-flex align-items-center bg-light justify-content-center"
          style={{
            height: "90vh",
            backgroundImage:
              'url("https://thumbs.dreamstime.com/b/mobile-apps-pattern-white-background-50171276.jpg")',
          }}
        >
          <Card.Title>
            <Image
              style={{ marginTop: "-5rem" }}
              src="https://i.gifer.com/origin/e0/e08f73642d422d94483c0ca96f737ac2_w200.gif"
              alt="img"
            />
            click on user to start chatting
          </Card.Title>
        </Card>
      )}
    </>
  );
};

export default SingleChat;
