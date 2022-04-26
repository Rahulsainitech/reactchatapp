import axios from "axios";
import React, { useState, useEffect } from "react";
import { Row, Col, Card, Image, Button } from "react-bootstrap";
import { ChatState } from "../../Context/ChatProvider";
import { AiOutlinePlusSquare } from "react-icons/ai";
import ChatLoading from "./ChatLoading";
import { getSender } from "../../config/Chatlogics";
import GroupChatModal from "./GroupChatModal";
import Swal from "sweetalert2";

const Mychat = ({fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      console.log("api/chat get data", data);
      setChats(data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong failed to load chat!!',
      })
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userinfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <>
      <Card
        style={{ width: "auto", height: "90vh", margin: "0" }}
        className={selectedChat ? "d-none d-md-block bg-light" : "d-flex bg-light"}
      >
        <Card.Title className="mt-3 cardtitle bg-info">
          <Row>
          <Col xs={4} className="mt-1 text-center "> MyChat</Col>
          <Col className="btndiv" xs={8}>
            {" "}
            <GroupChatModal >
            <Button className=" btn-light p-md-1">
              New Group Chat
              <AiOutlinePlusSquare />
            </Button>
            </GroupChatModal>
          </Col>
          </Row>
        </Card.Title>
        <Card.Body className="chatuser p-0 m-0 " >
          {chats ? (
            chats.map((chat) => {
              return (
                <Row
                  onClick={() => setSelectedChat(chat)}
                  style={{ cursor: "pointer",borderRadius:"4px" }}
                  className={selectedChat === chat ? "bguserselect p-0" : "bguser p-0"}
                >
                  <Col xs={4}>
                    <Image
                      src={chat.users[0].pic===user.pic?chat.users[1].pic:chat.users[0].pic}
                      alt="img"
                      style={{
                        width: "60px",
                        height: "60px",
                        overflow:"none",
                        borderRadius: "50%",
                        border:"2px solid",
                        borderColor:" #ff0000 #00ff00 #0000ff",
                        margin: "3px",
                        
                      }}
                    />
                  </Col>
                  <Col xs={8}>
                    <h6 className="pt-2">
                      {!chat.isGroupChat
                        ? getSender(loggedUser, chat.users)
                        : chat.chatName}
                    </h6>
                    <h6 className="text-muted">{chat.users[0].email===user.email?chat.users[1].email:chat.users[0].email}</h6>
                  </Col>
                </Row>
              );
            })
          ) : (
            <ChatLoading />
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export default Mychat;
