import React, { useState } from "react";
import { Button, Card, Form, Toast, ToastContainer,Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2"



const SignIn = () => {
  const navigate = useNavigate();
  const [showA, setShowA] = useState(false);
  const toggleShowA = () => setShowA(!showA);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      setShowA(true);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/users/login",
        { email, password },
        config
      );
      if (data.message === "notfound") {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'User not exist!',
        })
        // alert("user not exist");
        return;
      }
      window.location.reload();
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Login sucessfully',
        showConfirmButton: false,
        timer: 2500
      })
      localStorage.setItem("userinfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chat");
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      })
    }
  };
  return (
    <>
      <ToastContainer position="top-end"  className="p-3">
        <Toast show={showA} onClose={toggleShowA}>
          <Toast.Header className="bg-danger">
            {/* <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" /> */}
            <strong className="me-auto">Chatify</strong>
            <small className="text-muted">just now</small>
          </Toast.Header>
          <Toast.Body>Please filled all entries</Toast.Body>
        </Toast>
      </ToastContainer>
      {loading?<Spinner animation="border" variant="info" />:
        <Card style={{ padding: "1rem" }}>
        <Form>
          <Form.Group className="mb-3" controlId="formGroupEmailLogin">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupPasswordLogin">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </Form.Group>
          <h6 className="text-danger">
            {" "}
            Don't have an account ? click here..{" "}
          </h6>
          <Button
            className="col-12 mt-4 mb-2"
            variant="outline-primary"
            onClick={() => submitHandler()}
          >
            sign in
          </Button>{" "}
          <Button
            className="col-12 mb-2"
            variant="outline-danger"
            onClick={() => {
              setEmail("guest@example.com");
              setPassword("123456");
            }}
          >
            Get Guest User Credentials
          </Button>{" "}
        </Form>
      </Card>
      }
    </>
  );
};

export default SignIn;
