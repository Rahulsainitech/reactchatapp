import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { Modal, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "./useAvatar/UserBadgeItem";
import axios from "axios";
import UserListItem from "./useAvatar/UserListItem";
import Swal from "sweetalert2";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain,fetchMessages }) => {
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const [show, setShow] = useState(false);

  const { selectedChat, setSelectedChat, user } = ChatState();
  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      alert("error occured", error);
      setRenameLoading(false);
      setGroupChatName("");
    }
  };
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      Swal.fire({
        icon: 'warning',
        title: 'Only admin have acess to remove someone',
        showConfirmButton: false,
        timer: 1500
      })
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/groupremove",
        { chatId: selectedChat._id, userId: user1._id },
        config
      );
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setSelectedChat(data);
      fetchMessages()
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  const handleAddUser = async (user1) => {
    console.log(user1)
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      Swal.fire({
        icon: 'error',
        title: 'User already exist',
        showConfirmButton: false,
        timer: 1500
      })
      return;
    }
    console.log(user._id,"user id")
    console.log(selectedChat.groupAdmin,"admin id")
    if (selectedChat.groupAdmin._id !== user._id) {
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: 'Only admin have acess to add someone',
        showConfirmButton: false,
        timer: 1500
      })
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/groupadd",
        { chatId: selectedChat._id, userId: user1._id },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  const handleSearch = async (query) => {
    console.log(query)
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
      setSearchResult(data);
    } catch (error) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Oops! something went wrong',
        showConfirmButton: false,
        timer: 1500
      })
    }
  };

  return (
    <>
      <FaEye onClick={handleShow} />
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedChat.chatName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-wrap">
            {selectedChat.users.map((user) => (
              <UserBadgeItem
                key={user._id}
                user={user}
                handleFunction={() => handleRemove(user)}
              ></UserBadgeItem>
            ))}
          </div>
          <Row className="py-3">
            <Col xs={10}>
              <Form.Control
                size="sm"
                type="text"
                placeholder="Chat Name"
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </Col>
            <Col xs={2}>
              <Button
                size="sm"
                isloading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </Col>
          </Row>
          <Form.Control
            size="sm"
            type="text"
            placeholder="Add user to group"
            onChange={(e) => handleSearch(e.target.value)}
          />
          {loading ? (
            <Spinner animation="border" role="status" />
          ) : (
            searchResult?.map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={()=>handleAddUser(user)}
              />
            ))
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => {
              handleRemove(user);
            }}
          >
            Leave Group
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
