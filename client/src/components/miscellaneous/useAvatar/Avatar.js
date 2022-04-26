import React from "react";
import { Image } from "react-bootstrap";

const Avatar = ({src}) => {
  return (
    <span style={{borderRadius:"50%"}}>
      <Image src={src} alt="image" style={{width:"50px",height:"50px",borderRadius:"50%"}}/>
    </span>
  );
};

export default Avatar;
