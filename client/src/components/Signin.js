import React, { useState } from "react";
import { Button, Card, Form, Spinner } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const SignIn = () => {
  const navigate = useNavigate();
  const [showA, setShowA] = useState(false);
  const toggleShowA = () => setShowA(!showA);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);

  const submitHandler = async () => {
    
    if (!email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Please fill all the entry !",
      });
      return;
    }
    setLoading(true);
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
          icon: "error",
          title: "Oops...",
          text: "User not exist!",
        });
        
        return;
      }
      window.location.reload();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Login sucessfully",
        showConfirmButton: false,
        timer: 2500,
      });
      localStorage.setItem("userinfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chat");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  };
  return (
    <>
      {loading ? (
        <Spinner animation="border" variant="info" />
      ) : (
        <Card
          style={{
            padding: "2rem 1rem",
            display: "flex",
            width: "25rem",
            backgroundColor: "#00000065",
            borderRadius:"15px"
          }}
        >
          <h3 className="py-3 text-white">Chatify-Chatter</h3>
          <Form>
            <Card.Title className="text-white">SignIn</Card.Title>
            <Form.Group className="mb-3" controlId="formGroupEmailLogin">
              <Form.Control
                className="inputstyle"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupPasswordLogin">
              <Form.Control
               className="inputstyle"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </Form.Group>
            <NavLink className="text-danger" to="/signup">
              {" "}
              Don't have an account ? click here..{" "}
            </NavLink>
            <Button
              className="col-12 mt-4 mb-2"
              variant="outline-info"
              onClick={() => submitHandler()}
            >
              sign in
            </Button>{" "}
            <Button
              className="col-12 mb-2"
              variant="outline-light"
              onClick={() => {
                setEmail("guest@example.com");
                setPassword("123456");
              }}
            >
              Get Guest User Credentials
            </Button>{" "}
          </Form>
        </Card>
      )}
    </>
  );
};

export default SignIn;
