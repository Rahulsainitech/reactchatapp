import React from "react";
import { Row, Col, Image } from "react-bootstrap";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <>
      <div
        style={{ width: "20rem", margin: "10px 0", cursor: "pointer" }}
        className="bg-info"
        onClick={handleFunction}
      >
        <Row>
          <Col xs={4}>
            <Image
              src={user.pic}
              alt="img"
              style={{
                width: "50%",
                height: "80%",
                borderRadius: "50%",
                margin: "5px 0 0 5px",
              }}
            />
          </Col>
          <Col xs={8}>
            <h6>{user.name}</h6>
            <h6 className="text-muted">{user.email}</h6>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default UserListItem;
