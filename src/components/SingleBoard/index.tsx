import React, { useContext, useEffect } from "react";
import styled from "styled-components";
import ChangeButton from "../changeButton";
import { useState } from "react";
import './index.css';
import Button from "../buttons";
import { SudokuPuzzle } from "../../sudokuPuzzle";
import '../../App.css';
import gameContext from "../../gameContext";
import gameServices from "../../services/gameServices";
import { type } from "@testing-library/user-event/dist/type";
import socketService from "../../services/socketService";
import Timer from '../timer/index';
import cloneDeep from 'lodash.clonedeep';
import { getWaitingRoom, joiningRoom } from "../../services/apiService/api";
import { AlertCheckDialog, AlertErrorDialog, AlertWarningDialog } from "../dialogbox";
import {DateTime} from 'luxon';
var BoardContainer=styled.div`
width:100%;
height:90%;
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
position:absolute;
top:7%;
`;
const Square=styled.div
`width:50px;
 height:50px;
border:1px solid black;
background-color:#ffffff;
cursor:pointer;
font-size:25px;
text-align:center; 
&:hover
{
width:50px;
height:50px;
border:1px solid black;
background-color:#7f7f7f ;
cursor:pointer;
font-size:25px;
text-align:center; 
}
`;
const Table=styled.table`
border-collapse:collapse;
border:3px solid #8e324d;
background-color:#8e324d;
`;
const Td=styled.td`
padding:0px;
`;
const puzzleColor=styled.div`
background-color:cadetblue;
`
const SquareBottom=styled.div`
width:50px;
 height:50px;
border:1px solid black;
border-bottom:3px solid black;
background-color:#ffffff;
cursor:pointer;
font-size:25px;
text-align:center;
&:hover
{
  width:50px;
 height:50px;
border:1px solid black;
border-bottom:3px solid black;
background-color:#7f7f7f;
cursor:pointer;
font-size:25px;
text-align:center;
}
`
const SquareRight=styled.div`
width:50px;
 height:50px;
border:1px solid black;
border-right:3px solid black;
background-color:#ffffff;
cursor:pointer;
font-size:25px;
text-align:center;
&:hover
{
 width:50px;
 height:50px;
border:1px solid black;
border-right:3px solid black;
background-color:#7f7f7f;
cursor:pointer;
font-size:25px;
text-align:center;
}
`
const SquareBottomRight=styled.div`
width:50px;
 height:50px;
border:1px solid black;
border-bottom:3px solid black;
background-color:#ffffff;
border-right:3px solid black;
cursor:pointer;
font-size:25px;
text-align:center;
&:hover
{
  width:50px;
 height:50px;
border:1px solid black;
border-bottom:3px solid black;
background-color:#7f7f7f;
border-right:3px solid black;
cursor:pointer;
font-size:25px;
text-align:center;
}
`
const SquareBottomColor=styled.div`
width:50px;
 height:50px;
border:1px solid black;
border-bottom:3px solid black;
cursor:pointer;
font-size:25px;
text-align:center;
background-color:#00b8ff;
&:hover
{
  width:50px;
 height:50px;
border:1px solid black;
border-bottom:3px solid black;
cursor:pointer;
font-size:25px;
text-align:center;
background-color:#2498c9;
}
`
const SquareRightColor=styled.div`
width:50px;
 height:50px;
border:1px solid black;
border-right:3px solid black;
cursor:pointer;
font-size:25px;
text-align:center;
background-color:#00b8ff;

&:hover
{
  width:50px;
 height:50px;
border:1px solid black;
border-right:3px solid black;
cursor:pointer;
font-size:25px;
text-align:center;
background-color:#2498c9;
}
`
const SquareBottomRightColor=styled.div`
width:50px;
 height:50px;
border:1px solid black;
border-bottom:3px solid black;
border-right:3px solid black;
cursor:pointer;
font-size:25px;
text-align:center;
background-color:#00b8ff;

&:hover
{
  width:50px;
 height:50px;
border:1px solid black;
border-bottom:3px solid black;
border-right:3px solid black;
cursor:pointer;
font-size:25px;
text-align:center;
background-color:#2498c9;
}
`
const SquareColor=styled.div`
width:50px;
 height:50px;
border:1px solid black;
cursor:pointer;
font-size:25px;
text-align:center;
background-color:#00b8ff;

&:hover
{
  width:50px;
 height:50px;
border:1px solid black;
cursor:pointer;
font-size:25px;
text-align:center;
background-color:#2498c9;
}
`
const PlayStopper = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  bottom:0;
  left:0;
  top:0;
  z-index: 99;
  cursor: default;
`;
const NoteBox=styled.div`
box-sizing:content-box;
width:5px;
height:5px;
padding:5px;
font-size:10px;
color:#000000;
text-align:center;
display:inline-block;
float:left;
`

const User=styled.div`
width:auto;
height:auto;
border:2px solid black;
`
const UserContainer=styled.div`
display:flex;
flex-wrap:wrap;
gap:400px;
padding:10px;
`
export type ISudokuBoard=Array<Array<string|null>>;
function SingleBoard({level})
{
  const [value,setValue]=useState(0);
 const [board,setBoard]=useState<ISudokuBoard>([]);
 const[isClickable,setIsClickable]=useState([])
 const [row,setRow]=useState(-1);
 const [column,setColumn]=useState(-1);
 const [sdkPuzzle,setSdkPuzzle]=useState([]);
  const[isCliked,setIsClick]=useState(false);
  const[game1,setGame1]=useState([]);
  const[sol1,setSol1]=useState([]);
  const[puzzleButton,setPuzzleButton]=useState([]);
  const [timeval,setTimeVal]=useState(new Date());
  const {timeValue,setTimeValue}=useContext(gameContext);
  const {isGameStarted,setIsGameStarted}=useContext(gameContext);
  const {roomName,setRoomName}=useContext(gameContext);
  const {countMem,setCountMem}=useContext(gameContext);
  const {new_board,setNewBoard}=useContext(gameContext);
  const {timer,setTimer}=useContext(gameContext);
  const [text,setText]=useState("");
  const {stopGame,setStopGame}=useContext(gameContext);
  const {boardSolved,setBoardSolved}=useContext(gameContext);
  const [isNote,setIsNote]=useState(false);
  const [arrayNote,setArrayNote]=useState([...Array(9)].map(x=>[...Array(9)].map(x=>[...Array(9)].map(x=>x))));
  const [gameStarted,setGameStarted]=useState(false);
  const [firstPlayerScore,setFirstPlayerScore]=useState(0);
  const [secondPlayerScore,setSecondPlayerScore]=useState(0);
  const [singleTimer,setSingleTimer]=useState('00:00');
  const [coordinateHint,setCoordinateHint]=useState([]);
  const [hintClick,sethintClick]=useState(3);
  var current_user=JSON.parse(localStorage.getItem('current_user'));
  const delay=ms=>new Promise(rs=>setTimeout(rs,ms));
  var arr1=[];
  var arr2=[];
  
  var backToDefault=()=>
  {
    var t=game1;
    var t1=arrayCopy(board);
    var t2=isClickable;
    for(let i=0;i<9;i++)
    {
        for(let j=0;j<9;j++)
        {  var is_deletable=checkValidCoordinate(i,j,coordinateHint);
          if(!is_deletable)
          {
            if(t[i][j]!==t1[i][j])
            {
                t1[i][j]="";
                t2[i][j]=true;
            }
          }
        }
    }
    setIsClickable(t2);
    setBoard(t1);
  }
 
  var emptyNote=()=>{
    var temp_note=[...arrayNote];
    for(let i=0;i<9;i++)
    {
      for(let j=0;j<9;j++)
      {
        temp_note[i][j].splice(0,temp_note[i][j].length);
      }
    }
    setArrayNote(temp_note);
  }
  
  const updateTimer=()=>
  { 
    if(socketService.socket)
    { 
      gameServices.timerGame(socketService.socket,roomName,text);

    }
  };
  const checkLength=(ar)=>
  {
    var l=0;
    for(let i=0;i<9;i++)
    {
        for(let j=0;j<9;j++)
        {
            if(ar[i][j]!=="")
            {
                l++;
            }
        }
    }
    return l;
  }
  const checkWiner=async (board)=>{
    var b=board;
    var l=checkLength(b);
    let c1=0;
    var s=sol1;
    if(l===81)
    {
   for(let i=0;i<9;i++)
   {
    for(let j=0;j<9;j++)
    {
    if(b[i][j]===s[i][j])
    {
      c1++;
    }
  }
   }
      if(c1===81)
      { setGameStarted(false);
        var username=current_user.username;
        var level_picked=level;
        var time_completed=singleTimer;
        var date_completed=DateTime.fromISO(DateTime.now());
        gameServices.updateSingleBoard(socketService.socket,username,level_picked,time_completed,date_completed);
        AlertCheckDialog("Bạn đã hoàn thành thử thách.","Hoàn thành");
      }
      else{
        AlertCheckDialog("Đáp án vẫn chưa đúng.Hãy check lại nhé.","Thất bại");
      }
    }
}
    const handleOnStart=()=>{
      if(socketService.socket)
      {
        gameServices.onStartGame(socketService.socket,()=>{
        setIsGameStarted(true);
        });
      }
    }

  const handleUpdateTimer=()=>
  {
   if(stopGame)
   { 
   if(socketService.socket)
   {
    gameServices.onTimerGame(socketService.socket,(noti,timer)=>{
      setTimeValue(true);
      setTimer(timer);
      alert(noti);
    }
    )
  }
}
}
  
 
var initGameBoard=(list)=>{
    var boardd=list[0];
    var sol=list[1];
    var ar=[];
    var ar_puzzle=[];
    var ar_clickable=[];
    var ar_sol=[];
     for(let i=0;i<9;i++)
    { ar[i]=[];
      ar_puzzle[i]=[];
      ar_clickable[i]=[];
      ar_sol[i]=[];
      for(let j=0;j<9;j++)
      {
        if(boardd[i][j]!==0)
        {
          ar_puzzle[i][j]=true;
          ar[i][j]=boardd[i][j].toString();
          ar_clickable[i][j]=false;
        }
        else
        { 
          ar[i][j]='';
          ar_clickable[i][j]=true;
        }
        ar_sol[i][j]=sol[i][j].toString();
      }
    }  
     setBoard(ar);
     setSol1(ar_sol);
     var arr_copy=cloneDeep(ar);
     setGame1(arr_copy);
     emptyNote();
     setPuzzleButton(ar_puzzle);
     setIsClickable(ar_clickable);
     setGameStarted(true);
  }

useEffect(()=>{
  var current_user=localStorage.getItem('current_user');
  var roomName=localStorage.getItem('room_name');
  var token=localStorage.getItem('token');
  var socket=socketService.socket;
  if(!socket)
  { 
    return;
  }
  gameServices.singleSudokuPuzzle(socket,level).then((list)=>{
    initGameBoard(list);
  });
}
,[]);

  var handleClickCell=async(row,column)=>
  { 
    var newValue=value;
    var temp_note=[...arrayNote];
    setIsClick(true);
    setRow(row);
    setColumn(column);
    var isCl=arrayCopy(isClickable);
    if(!isNote)
    { temp_note[row][column].splice(0,temp_note[row][column].length);
      setArrayNote(temp_note)
      if(newValue!==0&&isCl[row][column]===true)
      {
      let newArray=[...board];
      newArray[row][column]=(newValue.toString());
      setBoard(newArray);
      setIsClickable(isCl);
      if(checkLength(newArray)===81)
      { 
       await checkWiner(newArray);
      }
      }
    }
    else{ 
      if(isCl[row][column]===true)
      {
      if(temp_note[row][column].includes(newValue))
      {
        temp_note[row][column].splice(temp_note[row][column].indexOf(newValue),1);
      }
      else{
        temp_note[row][column].push(newValue);
      }
      setArrayNote(temp_note);
    }
  }
  }
  var arrayCopy=(ar)=>
  {
    let ar1=[...ar]
    return ar1;
  };
  var handleButton=(name)=>{
      if(name==='New Game')
      {
        backToDefault();
      }
      else if(name==='Clear')
      {
          Clear(row,column);
      }
      else if(name==='Note')
      {
         Note();
      }
      else if(name==='Hint')
      {
        handleHintClick();
      }   
  }

  const Clear=(row,column)=>
  {
      var newArray=arrayCopy(board);
      var isClick=arrayCopy(isClickable);
      var is_deletable=checkValidCoordinate(row,column,coordinateHint);
      if(!is_deletable)
      {
      newArray[row][column]='';
      setBoard(newArray);
      isClick[row][column]=true
      setIsClickable(isClick);
      }
  }

  const Note=()=>{
      setIsNote(!isNote);
  }

  const handleHintClick=async()=>{
  
    if(hintClick>0)
   {
    sethintClick((prev)=>prev-1);
    var flag_board=false;
    let new_array=[...board];
    let coord_array=[...coordinateHint];
    var clickable_array=[...isClickable];
    if(hintClick%2===0)
    {
     for(let i=0;i<9;i++)
     {
      flag_board=false;
      for(let j=0;j<9;j++)
      {
        if(new_array[i][j]!==sol1[i][j])
        {
        new_array[i][j]=sol1[i][j];
        clickable_array[i][j]=false;
        let coord=`${i}:${j}`;
        coord_array.push(coord);
        flag_board=true;
        break;
        }
      }
    if(flag_board)
    {
      break;
    }
     }
    }
  else{
      for(let i=8;i>=0;i--)
      { 
        flag_board=false;
        for(let j=0;j<9;j++)
        { 
          if(new_array[i][j]!==sol1[i][j])
          { 
            new_array[i][j]=sol1[i][j];
            clickable_array[i][j]=false;
            let coord=`${i}:${j}`;
           coord_array.push(coord);
            flag_board=true;
            break;
          }
        }
        if(flag_board)
        {
          break;
        }
      }
    }
    setBoard(new_array);
    setIsClickable(clickable_array);
    setCoordinateHint(coord_array);
    if(checkLength(new_array)===81)
    { 
     await checkWiner(new_array);
    }
   }
   else
   {
  AlertWarningDialog("You have used all of your hint","No more hint");
   }
  }
 

 var checkValidCoordinate=(rIndex:number,cIndex:number,coordinateArr)=>
 {  
  for(let i=0;i<coordinateArr.length;i++)
  {   
      var ele=coordinateArr[i];
      var ele_part=ele.split(':');
      var rowIdx=ele_part[0];
      var columnIdx=ele_part[1];
      if(parseInt(rowIdx)===rIndex && parseInt(columnIdx)===cIndex)
      { 
        return true;
      }
  } 
    return false;
}

  var randomNumber=(n)=>
  {
    return Math.floor((Math.random()*n+1));
  }
 
    return(
<BoardContainer>
  <h2 className="text-light">Level:{level}</h2>
   <Timer isGameStarted={gameStarted} setSingleTimer={setSingleTimer}/> 
    <Table>
       <tbody>
           {
               board.map((row,rIndex)=>{
                   return(
                       <tr key={rIndex}>
                         {row.map((column,cIndex)=>{
                             return(<Td key={cIndex+rIndex} className="puzzleNumber" onClick={()=>handleClickCell(rIndex,cIndex)}>
                                {(!puzzleButton[rIndex][cIndex])?(((rIndex+1)%3===0&&(cIndex+1)%3===0)?<SquareBottomRight style={{color:checkValidCoordinate(rIndex,cIndex,coordinateHint)?'red':'black'}}>{column===''?arrayNote.map((r,rI)=>{return(r.map((c,cI)=>{return((cI===cIndex&&rI===rIndex)&&c.map((d,dI)=>{return(<NoteBox>{d}</NoteBox>)}))}))}):column}</SquareBottomRight>:(rIndex+1)%3===0?<SquareBottom style={{color:checkValidCoordinate(rIndex,cIndex,coordinateHint)?'red':'black'}}>{column===''?arrayNote.map((r,rI)=>{return(r.map((c,cI)=>{return((cI===cIndex&&rI===rIndex)&&c.map((d,dI)=>{return(<NoteBox>{d}</NoteBox>)}))}))}):column}</SquareBottom>:((cIndex+1)%3===0)?<SquareRight style={{color:checkValidCoordinate(rIndex,cIndex,coordinateHint)?'red':'black'}}>{column===''?arrayNote.map((r,rI)=>{return(r.map((c,cI)=>{return((cI===cIndex&&rI===rIndex)&&c.map((d,dI)=>{return(<NoteBox>{d}</NoteBox>)}))}))}):column}</SquareRight>:<Square style={{color:checkValidCoordinate(rIndex,cIndex,coordinateHint)?'red':'black'}}>{column===''?arrayNote.map((r,rI)=>{return(r.map((c,cI)=>{return((cI===cIndex&&rI===rIndex)&&c.map((d,dI)=>{return(<NoteBox>{d}</NoteBox>)}))}))}):column}</Square>):(((rIndex+1)%3===0&&(cIndex+1)%3===0)?<SquareBottomRightColor>{column===''?arrayNote.map((r,rI)=>{return(r.map((c,cI)=>{return((cI===cIndex&&rI===rIndex)&&c.map((d,dI)=>{return(<NoteBox>{d}</NoteBox>)}))}))}):column}</SquareBottomRightColor>:(rIndex+1)%3===0?<SquareBottomColor>{column===''?arrayNote.map((r,rI)=>{return(r.map((c,cI)=>{return((cI===cIndex&&rI===rIndex)&&c.map((d,dI)=>{return(<NoteBox>{d}</NoteBox>)}))}))}):column}</SquareBottomColor>:((cIndex+1)%3===0)?<SquareRightColor>{column===''?arrayNote.map((r,rI)=>{return(r.map((c,cI)=>{return((cI===cIndex&&rI===rIndex)&&c.map((d,dI)=>{return(<NoteBox>{d}</NoteBox>)}))}))}):column}</SquareRightColor>:<SquareColor>{column===''?arrayNote.map((r,rI)=>{return(r.map((c,cI)=>{return((cI===cIndex&&rI===rIndex)&&c.map((d,dI)=>{return(<NoteBox>{d}</NoteBox>)}))}))}):column}</SquareColor>)}
                             </Td>);
                         })}
                       </tr>
                   );
               })
           }
      </tbody>
    </Table>
    <ChangeButton setClickValue={setValue} selected={value}/>
    <Button handlePress={handleButton} isNote={isNote} hint_count={hintClick}/>
</BoardContainer>);
}
export default SingleBoard;