import React, { useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { Modal, Button,Image } from "react-bootstrap";


const ProfileModal = ({ user, children }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
        <Modal.Body className="mx-auto">
            <Image src={user.pic} style={{width:"200px",height:"200px",borderRadius:"50%",border:"5px solid",borderColor:" #ff0000 #00ff00 #0000ff"}} alt="pic"/>
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
