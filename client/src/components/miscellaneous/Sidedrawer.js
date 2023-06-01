import React, { useState } from "react";
import {
  Offcanvas,
  Col,
  NavDropdown,
  Row,
  Image,
  Button,
  FormControl,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
import { BsSearch } from "react-icons/bs";
import { BsFillBellFill } from "react-icons/bs";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import ChatLoading from "./ChatLoading";
import UserProfile from "./UserProfile";
import Swal from "sweetalert2";
import { getSender } from "../../config/Chatlogics";

const Sidedrawer = () => {
  const history = useNavigate();
  const {
    user,
    chats,
    setChats,
    setSelectedChat,
    notification,
    setNotifcation,
  } = ChatState();
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState();
  const [serachResult, setSearchResult] = useState();
  const [loading, setLoading] = useState();
  const [loadingChat, setLoadingChat] = useState();
  const [bell, setBell] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const logoutHandler = () => {
    localStorage.removeItem("userinfo");
    history("/");
  };

  const handlesearch = async () => {
    if (!search) {
      Swal.fire({
        icon: "error",
        title: "enter the name or email",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/users?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Sorry! failed to get search result",
      });
    }
  };
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post("/api/chat", { userId }, config);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      console.log(data);
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong! Try again after some time",
      });
    }
  };
  return (
    <>
      <div
        className="my-2 bg-info d-flex "
        style={{
          border: "1px solid black",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div style={{ cursor: "pointer" }}>
          <p onClick={handleShow} style={{ fontSize: "1.3rem" }}>
            <BsSearch />
            &nbsp;&nbsp;<span style={{ fontWeight: "500" }}>Search User</span>
          </p>
        </div>
        {/* <Col md={4} xs={5} className="text-center"> */}
        {/* <h5>Rahul-Chat-App</h5> */}
        {/* </Col> */}
        <div className="text-end" style={{ cursor: "pointer" }}>
          <span className="" onClick={() => setBell(bell ? false : true)}>
            <BsFillBellFill style={{ fontSize: "1.5rem", color: "red" }} />
            <sup
              style={{
                background: "red",
                padding: "0 3px",
                color: "white",
                borderRadius: "50%",
              }}
            >
              {notification.length}
            </sup>
          </span>
          <span
            style={{
              position: "absolute",
              top: "60px",
              right: "60px",
              zIndex: 3,
              backgroundColor: "lightblue",
              padding: " ",
              borderRadius: "24px",
            }}
          >
            {!notification.length && bell && "No new Messages found"}
            {notification.map((notif) => (
              <span
                key={notif._id}
                onClick={() => {
                  setSelectedChat(notif.chat);
                  setNotifcation(notification.filter((n) => n !== notif));
                }}
              >
                {notif.chat.isGroupChat
                  ? `New Message in ${notif.chat.chatName}`
                  : `New Message from ${getSender(user, notif.chat.users)}`}
              </span>
            ))}
          </span>
          &nbsp;&nbsp;&nbsp;
          <Image
            src={user.pic}
            style={{ width: "45px", height: "45px", borderRadius: "50%" }}
          />
          <NavDropdown
            title={user.name}
            id="basic-nav-dropdown"
            className="d-inline-block"
          >
            <ProfileModal user={user}>
              <NavDropdown.Item>My Profile</NavDropdown.Item>
            </ProfileModal>
            <NavDropdown.Item onClick={() => logoutHandler()}>
              Log Out
            </NavDropdown.Item>
          </NavDropdown>
        </div>
      </div>
      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header className="bg-info" closeButton>
          <Offcanvas.Title>Search user</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Row>
            <Col md={8} xs={8}>
              <FormControl
                type="search"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="me-2 d-inline"
                aria-label="Search"
              />
            </Col>
            <Col md={4} xs={4}>
              <Button variant="outline-info" onClick={() => handlesearch()}>
                <BsSearch />
              </Button>
            </Col>
          </Row>
          {loading ? (
            <ChatLoading />
          ) : (
            serachResult?.map((user) => (
              <UserProfile
                key={user._id}
                user={user}
                handleFunction={() => accessChat(user._id)}
              />
            ))
          )}
          {loadingChat && <Spinner animation="border" variant="info" />}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Sidedrawer;
