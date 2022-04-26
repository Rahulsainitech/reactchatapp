import React from 'react'
import {Card} from "react-bootstrap";
import SingleChat from '../SingleChat';
import { ChatState } from '../../Context/ChatProvider';

const ChatBox = ({fetchAgain,setFetchAgain}) => {
  const {selectedChat} = ChatState()
  return (
    <Card
    className={selectedChat?"d-block":"d-flex"}>
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />  
    </Card>
  )
}

export default ChatBox