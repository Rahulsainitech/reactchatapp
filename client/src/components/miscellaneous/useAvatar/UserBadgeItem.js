import React from "react";
import { ImCross } from "react-icons/im";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <>
      <p
      onClick={handleFunction}
      style={{cursor:"pointer",
      padding:"2px 7px",
      border:"1px solid green",
      margin:"6px 5px 0 0",
      borderRadius:"15px",
      background:"lightgray"
      }}
      >
        {user.name}&nbsp;&nbsp;&nbsp;
        <ImCross style={{color:"red"}}/>
      </p>
    </>
  );
};

export default UserBadgeItem;
