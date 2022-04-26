import React, {useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import Sidedrawer from "./miscellaneous/Sidedrawer";
import MyChats from "./miscellaneous/MyChat";
import ChatBox from "./miscellaneous/ChatBox";
import { Col, Row } from "react-bootstrap";

const Chat = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <>
      <Row className="m-0 p-0">
      {user && <Sidedrawer user={user} />}
        <Col md={4}>
          {user && (
            <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}{" "}
        </Col>
        <Col md={8}>
          {user && (
            <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}{" "}
        </Col>
      </Row>
    </>
  );
};

export default Chat;
