import React from "react";
import { Card, Col, Image, Row } from "react-bootstrap";

const UserProfile = ({ user, handleFunction }) => {
  return (
    <>
      <Card
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
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                border: "3px solid red",
              }}
            />
          </Col>
          <Col xs={8}>
            <h6>{user.name}</h6>
            <h6 className="text-muted">{user.email}</h6>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default UserProfile;
