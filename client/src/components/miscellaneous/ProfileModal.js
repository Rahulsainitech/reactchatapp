import React, { useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Modal, Button, Image, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import Swal from "sweetalert2";
const ProfileModal = ({ user, children }) => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Delete account
    </Tooltip>
  );
  const userInfo = JSON.parse(localStorage.getItem("userinfo"));
  console.log("user data",userInfo._id)
  const [userid, setUserId] = useState("");
  const deleteAccount = async () => {
    setUserId(userInfo._id);
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const { data } = await Axios.post(
        "/api/users/deleteuser",
        { userid },
        config
      );
      console.log("data from delete account",data)
      if (data.message === "user delete successfully") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "User delete successfully",
        });
        // window.location.reload();
        localStorage.removeItem("userinfo");
        navigate("/");
        return;
      }
     
    } catch (error) {
      console.log(error, "dfdk");
    }
  };

  return (
    <>
      {children ? (
        <span onClick={handleShow}>{children}</span>
      ) : (
        <FaRegEye onClick={handleShow} />
      )}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header className="bg-info" closeButton>
          <Modal.Title>{user.name}</Modal.Title>
        </Modal.Header>
        <OverlayTrigger
          placement="left"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip}
        >
          <h4
            style={{
              position: "absolute",
              top: "65px",
              right: "5px",
              color: "red",
            }}
          >
            <RiDeleteBin6Line onClick={deleteAccount} />
          </h4>
        </OverlayTrigger>
        ,
        <Modal.Body className="mx-auto">
          <Image
            src={user.pic}
            style={{
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              border: "5px solid",
              borderColor: " #ff0000 #00ff00 #0000ff",
            }}
            alt="pic"
          />
          <p className="text-center text-muted">{user.email}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="info" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProfileModal;
