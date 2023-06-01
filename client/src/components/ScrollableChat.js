import React from "react";
// import { Tooltip,Image } from "react-bootstrap";
import ScrolablleFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/Chatlogics";
import { ChatState } from "../Context/ChatProvider";
import Avatar from "./miscellaneous/useAvatar/Avatar";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  // console.log("message",messages)
  return (
    <ScrolablleFeed>
      {messages &&
        messages.map((m, i) => {
          return (
            <div style={{ display: "flex" }} key={m._id}>
              {isSameSender(messages, m, i, user._id) ||
                (isLastMessage(messages, i, user._id) && (
                  <Avatar src={m.sender.pic} />
                ))}
              <span
                style={{
                  backgroundColor: `${
                    m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                  }`,
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                  marginLeft: isSameSenderMargin(messages, m, i, user._id),
                  marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                }}
              >
                {m.content}
                {/* <p style={{ postion: "relative", right: "0" }}>{m.createdAt}</p> */}
              </span>
            </div>
          );
        })}
    </ScrolablleFeed>
  );
};

export default ScrollableChat;
