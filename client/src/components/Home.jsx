import React,{useEffect} from "react";
import { Tabs,Tab, Card} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Signin from "./Signin";
import Signup from "./Signup";

const Home = () => {
  const history = useNavigate()
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"))
    if(user)history('/chat')
  }, [history])
  
  return (
    <div className="home">
    <Signin/>
    {/* <Signup/> */}

      {/* <Card style={{height:"auto",width:"auto",marginTop:"5rem"}} className="mx-1">
      <Card.Title className="text-center" style={{background:"pink",margin:"1rem",padding:".5rem"}}>Chattify-chatter</Card.Title>
        <Tabs
          defaultActiveKey="home"
          transition={false}
          id="noanim-tab-example"
          className="mb-3"
        >
          <Tab eventKey="home" title="Sign IN">
          <Signin/>
          </Tab>
          <Tab eventKey="profile" title="Sign UP">
          <Signup/>
          </Tab>
         
        </Tabs>
      </Card> */}
    </div>
  );
};

export default Home;
