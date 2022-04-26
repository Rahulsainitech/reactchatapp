import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { AiOutlinePlusSquare } from "react-icons/ai";
import { ChatState } from "../../Context/ChatProvider";
import UserListItem from "./useAvatar/UserListItem";
import UserBadgeItem from "./useAvatar/UserBadgeItem";
import axios from "axios";
import Swal from "sweetalert2";

const GroupChatModal = ({ childeren }) => {
  const [show, setShow] = useState(false);
  const { user, chats, setChats } = ChatState();

  const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/users?search=${search}`, config);
      console.log(data);
      setLoading(false);
      console.log("serach reuslta", searchResult);
      setSearchResult(data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
      return;
    }
  };
  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "User Already added!",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };
  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill all the field properly",
      });
      return;
    } else {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(
          "/api/chat/group",
          {
            name: groupChatName,
            users: JSON.stringify(selectedUsers.map((u) => u._id)),
          },
          config
        );
        setChats([data, ...chats]);
        setShow(false);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "New Group Created, Sucessfully",
          showConfirmButton: false,
          timer: 2500,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error,
        });
      }
    }
  };

  return (
    <>
      <span onClick={() => setShow(true)}>
        {" "}
        <Button className=" btn-light">
          New Group Chat&nbsp;
          <AiOutlinePlusSquare style={{ fontSize: "1.5rem" }} />
        </Button>
      </span>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header className="bg-info" closeButton>
          <Modal.Title>Create Group Chat</Modal.Title>
        </Modal.Header>
        <Modal.Body className="mx-auto">
          <Row>
            <Col xs={12} className="mb-3">
              <Form.Control
                type="text"
                onChange={(e) => setGroupChatName(e.target.value)}
                placeholder="Enter user Name"
              />
            </Col>
            <Col xs={12} className="mb-3">
              <Form.Control
                type="email"
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Enter email"
              />
              <div div className="d-flex">
                {selectedUsers.map((u) => (
                  <UserBadgeItem
                    key={user._id}
                    user={u}
                    handleFunction={() => handleDelete(u)}
                  />
                ))}
              </div>
              {loading ? (
                // <ChatLoading />
                <div>Loading...</div>
              ) : (
                searchResult
                  ?.slice(0, 4)
                  .map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleGroup(user)}
                    />
                  ))
              )}
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="info" onClick={handleSubmit}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default GroupChatModal;
