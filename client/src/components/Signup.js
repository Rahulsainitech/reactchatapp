import React, { useState } from "react";
import { Card, Form, Col,Row,Button,Toast } from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import axios from "axios"
import Swal from "sweetalert2"

const Signup = () => {
  const navigate = useNavigate()
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmpassword, setConfirmPassword] = useState();
  const [pic, setPic] = useState();
  const [loading,setLoading] = useState(true)
  const [showA,setShowA] = useState(false)
  const toggleShowA = () => setShowA(!showA);
  const postDetails = (pics) => {
    if (pics === undefined){
      setShowA(true)
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/jpg"){
      const data = new FormData()
      data.append("file",pics);
      data.append("upload_preset", "Instaclone")
        data.append("cloud_name", "geeta9812")
      fetch("https://api.cloudinary.com/v1_1/geeta9812/image/upload",{
        method:"post",
        body:data,
      }).then((res)=>res.json())
      .then((data)=>{
        setPic(data.url.toString());
        setLoading(false);
      })
    }
  };
  const submitHandler = async() => {
setLoading(true)
if (!name|| !email || !password || !confirmpassword){
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'Please fill all the entries!',
  })

  return
}
if (password !== confirmpassword){
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'Password is not matching!',
  })
  return
}
try {
  const config ={
    headers:{
      "Content-Type":"application/json"
    },
  }
  const {data}= await axios.post("/api/users",
  {name,email,password,pic},
  config);
  Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: 'Your signup successfully',
    showConfirmButton: false,
    timer: 2500
  })
  localStorage.setItem("userinfo",JSON.stringify(data))
  setLoading(false)
  window.location.reload()
  navigate("/chat")
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
      <Card style={{ padding: "1rem" }}>
        <Form>
          <Form.Group className="mb-3" controlId="formGroupName">
            <Form.Label>FullName</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Name"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
          </Form.Group>
         <Row>
         <Col xs={6}>
          <Form.Group className="mb-3" controlId="formGroupPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </Form.Group></Col>
         <Col xs={6}> <Form.Group className="mb-3" controlId="formGroupcPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmpassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Password"
            />
          </Form.Group></Col>
         </Row>
          <Form.Group controlId="formFileSm" className="mb-3">
            <Form.Label>Upload Profile pic</Form.Label>
            <Form.Control
              type="file"
              p={1.5}
              accept="image/*"
              onChange={(e) => postDetails(e.target.files[0])}
              size="sm"
            />
          </Form.Group>
          <h6 className="text-danger">
            {" "}
            Already have an account ? click here..{" "}
          </h6>
          <Button className="col-12 m-2" variant="outline-success" onClick={() => submitHandler()} isloading={loading}>
            Sign up
          </Button>{" "}
        </Form>
        <Toast show={showA} onClose={toggleShowA}>
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded me-2"
              alt=""
            />
            <strong className="me-auto">Bootstrap</strong>
            <small>11 mins ago</small>
          </Toast.Header>
          <Toast.Body>Woohoo, you're reading this text in a Toast!</Toast.Body>
        </Toast>
      </Card>
    </>
  );
};

export default Signup;
