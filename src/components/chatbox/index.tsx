import React, { useEffect, useRef, useState } from "react";
import {
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBCardFooter,
  MDBIcon,
} from "mdb-react-ui-kit";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import gameServices from "../../services/gameServices";
import socketService from "../../services/socketService";
import cloneDeep from "lodash.clonedeep";
import EmojiPicker from 'emoji-picker-react';
import { DateTime } from 'luxon';

export type IMessageType=Array<string|null>;

const ChatBox=()=>
{
 var current_user=JSON.parse(localStorage.getItem("current_user"));
 const [isTyping,setIsTyping]=useState(false);
 const [username,setUsername]=useState('');
 const [counter,setCounter]=useState(0);
 const [currentMess,setCurrentMess]=useState('');
 const [messageArr,setMessageArr]=useState<IMessageType>([]);
 const [inputValue,setInputValue]=useState('');
 const [isTodayMess,setIsTodayMess]=useState(0);
 const [showPicker,setShowPicker]=useState(false);
 const [isInit,setIsInit]=useState(true);
 const [recordCount,setRecordCount]=useState(5);
 const [currentScroll,setCurrentScroll]=useState(0);
 const [prevScroll,setPrevScroll]=useState(0);
 const [isNewMess,setIsNewMess]=useState(-1);
 const messagesContainerRef = useRef(null);
 const notify_sound=require('../../asset/mixkit-doorbell-single-press-333.mp3');
 const audio_player=useRef(null);
 var onchangeTyping=(e)=>
 {
    if(socketService.socket)
    { 
      var username_value=current_user.display_name;
      setCurrentMess(e.target.value);
      setInputValue(e.target.value);
      if(socketService.socket)
      {
      gameServices.whoTyping(socketService.socket,username_value);
    }
 }
}

var playAudio=()=>
{
 audio_player.current.play();
}

var handleScroll=async(e)=>
{
  e.preventDefault(); 
  var first_user_displayname=localStorage.getItem('first_user_displayname');
  var second_user_displayname=localStorage.getItem('second_user_displayname');
 if(e.target.scrollTop===0)
 { var curr_scroll=messagesContainerRef.current.scrollHeight-messagesContainerRef.current.clientHeight;
  if(curr_scroll>prevScroll)
  {  
    setPrevScroll(curr_scroll);
    setCurrentScroll(curr_scroll);
  } 
  setRecordCount(prev=>prev+5);
  if(socketService.socket)
  { 
    await gameServices.initChatGroup(socketService.socket,recordCount,first_user_displayname,second_user_displayname,false);
  }

}
}

 var submitMessage=async(e)=>
 {
   e.preventDefault();
   setIsInit(true);
   if(inputValue ==="" || inputValue==null)
   {
    return;
   }
   var room_name=localStorage.getItem('room_name');
   var timeStamp=DateTime.now();
  setIsTodayMess(prev=>(prev+1));
   var current_mess=`${current_user.display_name}@${current_user.avatar}@${timeStamp.toFormat('hh:mm')}@${''}@${currentMess}`;
   setInputValue("");
   if(socketService.socket)
   {
  await gameServices.sendMessage(socketService.socket,current_mess,room_name,timeStamp);
   }
   setCurrentMess("");
 };

var messageHandling=(mess:string)=>
{
   var arr_split=mess.split("@");
   var username=arr_split[0];
   var avatar=arr_split[1];
   var cur_timestamp=arr_split[2];
   var is_first=arr_split[3];
   var message="";
   for(let i=4;i<arr_split.length;i++)
   {
    message+=arr_split[i];
   }
   var ar=[];
   ar.push(username,avatar,message,cur_timestamp,is_first);
   return ar;
};

 var timeInterval=()=>{
  setCounter((prev)=>prev+1000);
}
const scrollToBottom = () => {
    if(messagesContainerRef.current)
    {  
      messagesContainerRef.current.scrollTop=messagesContainerRef.current.scrollHeight;
    }
};

var onKeyDownEvent=(e)=>
{
  if(e.keyCode===13 && e.shiftKey===false)
  {
    e.preventDefault();
   (e.target.form as HTMLFormElement).requestSubmit();
  }

}

const showEmojiPicker=()=>
{
  setShowPicker(prev=>!prev);
}

const onEmojiClickEvent=(e)=>
{ 
 try
 {
  setInputValue((prev)=>prev+e.emoji);
  setCurrentMess((prev)=>prev+e.emoji);
  setShowPicker(false);
 }
 catch(error)
 {
 }
}

 useEffect(()=>
 {             
      let t=null;
      t=setInterval(timeInterval,1000);
      if(socketService.socket)
      {
      gameServices.onWhoTyping(socketService.socket,(username)=>{
        setCounter(0);
        setIsTyping(true);
        setUsername(username);
   });
  }
  return () => clearInterval(t);
 },[]);

//  useEffect(()=>{
//    if(socketService.socket)
//    { 
//     var room_name=localStorage.getItem('room_name');
//     const joined=gameServices.joinGameRoom(socketService.socket,room_name).catch((error)=>{alert(error);});
//     gameServices.initChatGroup(socketService.socket,room_name);
//    }

//  },[])

 useEffect(()=>{



if(socketService.socket)
{ 
  if(isInit)
  { 
  scrollToBottom();
  setIsInit(false);
  }
gameServices.onInitChatGroup(socketService.socket,(array_mess)=>
{
   setMessageArr(array_mess);
});
if((messagesContainerRef.current.scrollHeight-messagesContainerRef.current.clientHeight)!==currentScroll && !isInit)
{ 
 messagesContainerRef.current.scrollTop=(messagesContainerRef.current.scrollHeight-messagesContainerRef.current.clientHeight)-currentScroll;
}

gameServices.onSendMessage(socketService.socket,(curr_mess,is_first)=>
{ 
  var arr_mess=cloneDeep(messageArr);
  arr_mess.push(curr_mess)
  setMessageArr(arr_mess);
});
}

 },[messageArr]);
return(
    <div>
    <MDBRow className="d-flex justify-content-center">
      <MDBCol md="10" lg="5" xl="6">
        <MDBCard id="chat2" style={{ borderRadius: "15px" }}>
          <MDBCardHeader className="d-flex justify-content-between align-items-center p-3">
            <h5 className="mb-0">Chat</h5>
          </MDBCardHeader>
          <MDBCardBody>
          <div className="scrollbar scrollbar-primary  mt-3 mx-auto"
            ref={messagesContainerRef} onScroll={handleScroll}
            style={{height: "200px", overflowY: "auto"}}
          > 
            { messageArr!=null ? (messageArr.map((mess,idx)=>{
              var mess_info=messageHandling(mess);          
              return(
               mess_info[0] === current_user.display_name ? 
               ( <div>
              {mess_info[4]!==''?(<div className="divider d-flex align-items-center mb-4">
                  <p
                    className="text-center mx-3 mb-0"
                    style={{ color: "#a2aab7" }}
                  >
                    {mess_info[4]}                  
                  </p>
            </div>):null}
                <div className="d-flex flex-row justify-content-start mb-4">
                  <img
                  src={mess_info[1]}
                  alt="avatar 1"
                  style={{ width: "45px", height: "100%" }}
                />
              <div>
                <p
                    className="small p-2 ms-3 mb-1 rounded-3"
                    style={{ backgroundColor: "#f5f6f7" }}
                  >
                    {mess_info[2]}
                </p>
                  <p className="small ms-3 mb-3 rounded-3 text-muted">
                   {mess_info[3]}
                  </p>
                  </div>
                  </div>
                  </div>
               ) :
               (
              <div>           
              {mess_info[4]!==''?(<div className="divider d-flex align-items-center mb-4">
                  <p
                    className="text-center mx-3 mb-0"
                    style={{ color: "#a2aab7" }}
                  >
                  {mess_info[4]}
                  </p>
            </div>):null}
                <div className="d-flex flex-row justify-content-end mb-4 pt-1">
                 <div>
                  <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">
                  {mess_info[2]}
                  </p>
                   <p className="small mb-3 ms-3 rounded-3 text-muted">
                  {mess_info[3]}
                  </p>                 
                </div>
                  <img
                  src={mess_info[1]}
                  alt="avatar 1"
                  style={{ width: "45px", height: "100%" }}
                />
                </div>
                </div>
               )
              )
            })):null}

              {/* <div className="d-flex flex-row justify-content-start">
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"
                  alt="avatar 1"
                  style={{ width: "45px", height: "100%" }}
                />
                <div>
                  <p
                    className="small p-2 ms-3 mb-1 rounded-3"
                    style={{ backgroundColor: "#f5f6f7" }}
                  >
                    Hi
                  </p>
                  <p
                    className="small p-2 ms-3 mb-1 rounded-3"
                    style={{ backgroundColor: "#f5f6f7" }}
                  >
                    How are you ...???
                  </p>
                  <p
                    className="small p-2 ms-3 mb-1 rounded-3"
                    style={{ backgroundColor: "#f5f6f7" }}
                  >
                    What are you doing tomorrow? Can we come up a bar?
                  </p>
                  <p className="small ms-3 mb-3 rounded-3 text-muted">
                    23:58
                  </p>
                </div>
              </div>

              <div className="d-flex flex-row justify-content-end mb-4 pt-1">
                <div>
                  <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">
                    Hiii, I'm good.
                  </p>
                  <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">
                    How are you doing?
                  </p>
                  <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">
                    Long time no see! Tomorrow office. will be free on sunday.
                  </p>
                  <p className="small me-3 mb-3 rounded-3 text-muted d-flex justify-content-end">
                    00:06
                  </p>
                </div>
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp"
                  alt="avatar 1"
                  style={{ width: "45px", height: "100%" }}
                />
              </div>

              <div className="d-flex flex-row justify-content-start mb-4">
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"
                  alt="avatar 1"
                  style={{ width: "45px", height: "100%" }}
                />
                <div>
                  <p
                    className="small p-2 ms-3 mb-1 rounded-3"
                    style={{ backgroundColor: "#f5f6f7" }}
                  >
                    Okay
                  </p>
                  <p
                    className="small p-2 ms-3 mb-1 rounded-3"
                    style={{ backgroundColor: "#f5f6f7" }}
                  >
                    We will go on Sunday?
                  </p>
                  <p className="small ms-3 mb-3 rounded-3 text-muted">
                    00:07
                  </p>
                </div>
              </div>

              <div className="d-flex flex-row justify-content-end mb-4">
                <div>
                  <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">
                    That's awesome!
                  </p>
                  <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">
                    I will meet you Sandon Square sharp at 10 AM
                  </p>
                  <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">
                    Is that okay?
                  </p>
                  <p className="small me-3 mb-3 rounded-3 text-muted d-flex justify-content-end">
                    00:09
                  </p>
                </div>
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp"
                  alt="avatar 1"
                  style={{ width: "45px", height: "100%" }}
                />
              </div>
              <div className="d-flex flex-row justify-content-start mb-4">
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"
                  alt="avatar 1"
                  style={{ width: "45px", height: "100%" }}
                />
                <div>
                  <p
                    className="small p-2 ms-3 mb-1 rounded-3"
                    style={{ backgroundColor: "#f5f6f7" }}
                  >
                    Okay i will meet you on Sandon Square
                  </p>
                  <p className="small ms-3 mb-3 rounded-3 text-muted">
                    00:11
                  </p>
                </div>
              </div>

              <div className="d-flex flex-row justify-content-end mb-4">
                <div>
                  <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">
                    Do you have pictures of Matley Marriage?
                  </p>
                  <p className="small me-3 mb-3 rounded-3 text-muted d-flex justify-content-end">
                    00:11
                  </p>
                </div>
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp"
                  alt="avatar 1"
                  style={{ width: "45px", height: "100%" }}
                />
              </div>
              <div className="d-flex flex-row justify-content-start mb-4">
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"
                  alt="avatar 1"
                  style={{ width: "45px", height: "100%" }}
                />
                <div>
                  <p
                    className="small p-2 ms-3 mb-1 rounded-3"
                    style={{ backgroundColor: "#f5f6f7" }}
                  >
                    Sorry I don't have. i changed my phone.
                  </p>
                  <p className="small ms-3 mb-3 rounded-3 text-muted">
                    00:13
                  </p>
                </div>
              </div>

              <div className="d-flex flex-row justify-content-end">
                <div>
                  <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">
                    Okay then see you on sunday!!
                  </p>
                  <p className="small me-3 mb-3 rounded-3 text-muted d-flex justify-content-end">
                    00:15
                  </p>
                </div>
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp"
                  alt="avatar 1"
                  style={{ width: "45px", height: "100%" }}
                />
              </div> */}
          </div>
          {isTyping&&counter<1000?(<div className="who-typing">{username} is typing....</div>):(<div className="who-typing"></div>)}
          </MDBCardBody>

          <form onSubmit={submitMessage}> 
          <MDBCardFooter className="text-muted d-flex justify-content-start align-items-center p-3">
            <img
              src={current_user.avatar}
              alt="avatar 3"
              style={{ width: "45px", height: "100%" }}
            />
            <textarea
              value={inputValue}
              className="form-control form-control-lg"
              onChange={onchangeTyping}
              id="exampleFormControlInput1"
              placeholder="Type message"
              onKeyDown={onKeyDownEvent}
            >
            </textarea>
            <a className="ms-1 text-muted" onClick={playAudio}>
              <MDBIcon fas icon="bell"/>
            </a>
            <audio ref={audio_player} src={notify_sound}></audio>
            <a className="ms-3 text-muted" onClick={showEmojiPicker}>
              <MDBIcon fas icon="smile"/>
            </a>
            {showPicker && <EmojiPicker style={{position:"absolute", color:'whitesmoke'}} onEmojiClick={onEmojiClickEvent}/>}          
            <a className="ms-3" onClick={submitMessage}>
              <MDBIcon fas icon="paper-plane"/>
            </a>

          </MDBCardFooter>
          </form>
        </MDBCard>
      </MDBCol>
    </MDBRow>
    </div>
);
};

export default ChatBox;
