import axios from "axios";
import {useNavigate,useParams,useSearchParams,useLocation} from "react-router-dom";
import { useRef, useContext } from 'react';
import gameContext from "../../gameContext";
import {useEffect} from 'react';
import { AlertCheckDialog,AlertErrorDialog,AlertQuestionDialog,AlertWarningDialog } from "../../components/dialogbox";
const URL='https://sudoku-server-2sz5.onrender.com/';
const CLIENT_URL='https://sudoku-master-2sz5.onrender.com';
const list=[];
const populate_list=(data)=>{list.push(data)};
const addUser=async (data) =>{
    try{
    return await axios.post(`${URL}/verify`,data).then((res)=>{
        let response_data=res.data.message;
        AlertCheckDialog(res.data.message,'Gửi email thành công');
    });
    }
    catch(error)
    {   if(error.response.status===409)
        {
            AlertErrorDialog(error.response.data.message,'Thông tin đã tồn tại');
        }
        console.log('There is '+error.message+' in the process');
    }
}
const getUserRegisterRes=(isChecked)=>{
   if(!isChecked)
   {
    try
   {
    const path=window.location.href;
    if(path.includes("?"))
    {
    var email=path.split('?');
    var email_value=email[1].split('=')[1];
    return axios.get(`${URL}/login`,{params:{email:email_value}}).then((res)=>{
   let response_data=res.data.message;
    AlertCheckDialog(response_data,"Đăng ký thành công");
});
    }
    else{
        return;
    }
    
   }
   catch(error)
   { if(error.response.status===409)
    {
        AlertErrorDialog(error.response.data.message,'Lỗi đăng ký');
    }
    console.log('There is'+error.message+' in the process');
   }
}
else{
    return;
}
}
const loginUser=async(data)=>
   {                         
    try{
     return await axios.post(`${URL}/login`,data).then(async(res)=>{
       if(res.data.message!=='')
       {
           AlertErrorDialog(res.data.message,'Đăng nhập thất bại');
       }
       else{
       let verify_data={
        token:res.data.token,
        username:res.data.username
       };
       let is_valid_token=await verifyToken(verify_data);
       if(is_valid_token.status===200)
       {
        var tokenNizer=
        {
           token:res.data.token
        }
        localStorage.setItem('current_user',JSON.stringify(is_valid_token.data.message));
        list.push(res.data.email);
        list.push(res.data.username);
        list.push(res.data.token);
        localStorage.setItem('token',res.data.token);
        await joiningHall(tokenNizer);
       }
       else
       {
        AlertErrorDialog(res.data.message,'Token không hợp lệ');    
       }
    }
     });
    }
    catch(error)
    {
        console.log('There is '+error.message+' in the process');
    }
}
const verifyToken=async(data)=>{
    try{
   return await axios.post(`${URL}/auth/verify`,data).then((res)=>{
      return res;
   });
       }
    catch(error)
    {    if(error.response.status===401)
        {   localStorage.setItem('token','');
            AlertWarningDialog("Token đã hết phiên làm việc.Hãy đăng nhập lại","Token hết hạn");
            window.location.assign('/login');
        }
         throw error;
    }
}

const joiningHall=async(token)=>{
    try
    {
    return await axios.get(`${URL}/hall`,{params:{'token':token.token}}).then((res)=>{
        if(res.status===200)
        {
            window.location.assign('/hall');
        }
    })
    }
    catch(err)
    {
        if(err.response.status===401)
        {
            window.location.assign(`${CLIENT_URL}/login`);
            localStorage.removeItem('token');
        }
    }
}

const joiningLevelPicker=async(token)=>{
    try
    {
    return await axios.get(`${URL}/hall`,{params:{'token':token.token}}).then((res)=>{
        if(res.status===200)
        {
            window.location.assign('/level');
        }
    })
    }
    catch(err)
    {
        if(err.response.status===401)
        {
            window.location.assign(`${CLIENT_URL}/login`);
            localStorage.removeItem('token');
        }
    }
}

const joiningRoom=async(token)=>{
    try{
          return await axios.get(`${URL}/join`,{params:{'token':token.token}}).then((res)=>{
            if(res.status===200)
            {   
                window.location.assign('/join');
            }
          });
    }
    catch(error)
    {   if(error.response.status===401)
        {
            window.location.assign(`${CLIENT_URL}/login`);
            localStorage.removeItem('token');
        }
        console.log('There is '+error+' in the process');
    }
}

const userInfo=async(token,username)=>{
    try
    { console.log("click here");
      return await axios.get(`${URL}/user_profile/${username}`,{params:{'token':token}}).then((res)=>{
        if(res.status===200)
        {   
             window.location.assign(`/user_profile/${username}`);     
        }
      }); 
    }
    catch(error)
    {   if(error.response.status===404)
        {
         AlertErrorDialog("Không tìm thấy thông tin user này","Không tìm thấy user");
        }
        else if(error.response.status===401)
        {
            localStorage.removeItem('token');
            window.location.assign(`${CLIENT_URL}/login`);
        }
        console.log('There is '+error+' in the process');
        throw error;
    }
}

const userDetail=async(token,username,data)=>
{
 try
 {
  return await axios.put(`${URL}/user_detail/${username}?token=${token}`,data).then((res)=>{
       if(res.status===200)
       {
      localStorage.removeItem('current_user');
      localStorage.setItem('current_user',JSON.stringify(res.data.message));
      AlertCheckDialog("Đã cập nhật thông tin thành công.","Cập nhật thông tin");
      return res.status;
       }
  });
 }
 catch(error)
 {
   if(error.response.status===404 || error.response.status===401)
   {
    AlertErrorDialog(error.response.data.message,"Cập nhật thông tin");
   }
 }
}
const getUserDetail=async(token,username)=>
{
try{
    return await axios.get(`${URL}/user_detail/${username}`,{params:{token:token}}).then((res)=>{
   if(res.status===200)
   {
    window.location.assign(`${CLIENT_URL}/user_detail/${username}`);
   }
    });
}
catch(error)
{
    if(error.response.status===401 || error.response.status===404)
    {
        
        localStorage.removeItem('token');
        window.location.assign(`${CLIENT_URL}/login`);
    }
}
}
const getTokenImageServer=async(payload,token,username)=>
{
  try
  {
    var res=await axios.post(`${URL}/user_detail/${username}?token=${token}`,payload);
    var list_value=[];
    list_value.push(res.data.token);
    list_value.push(res.data.expire);
    list_value.push(res.data.signature);
    return list_value;
  }
  catch(err)
  {
    throw err;
  }
}

const uploadImageToServer=async(data)=>
{
 try
 {  var list=[];
    var res=await axios.post('https://upload.imagekit.io/api/v1/files/upload',data,{headers:{"Content-Type":"multipart/form-data"}});
    var url='';
    var status=0;
    if(res.status===200)
    {
        url=res.data.url;
        status=200;        
    }
    list.push(url);
    list.push(status);
    return list;
 }
 catch(err)
 {
    AlertErrorDialog(err.toString(),"Có lỗi khi upload avatar");
 }
}

const postComment=async(token,data)=>
{
  try{
    return await axios.post(`${URL}/comment_submit?token=${token}`,data).then(async(res)=>{
        if(res.status===200)
        {
          AlertCheckDialog(res.data.translated_mess,"Gửi comment thành công");
        }
    })
}

catch(err)
{
    if(err.response.status===401 || err.response.status===404)
    {
        window.location.assign(`${CLIENT_URL}/login`);
    }
    else if(err.response.status===503)
    {
      AlertErrorDialog(err.response.data.error_mess,"Lỗi server,vui lòng gửi lại");
    }
}
}

const countNumsComment=async(token)=>
{
    try
    {
     return await axios.get(`${URL}/count_comment`,{params:{token:token}}).then((res)=>
     {
      var nums_comment=res.data.count_comment;
      return nums_comment;
     })
    }
    catch(err)
    {
        if(err.response.status===401 || err.response.status===404)
        {
         localStorage.removeItem('token');
         window.location.assign(`${CLIENT_URL}/login`);
        }
    }
}


const getWaitingRoom=async(token,room_name)=>
{
try
{
  return await axios.get(`${URL}/waiting_room/${room_name}`,{params:{'token':token}}).then((res)=>
  {
   if(res.status===200)
   {
     var room_name=res.data.room_name;
     localStorage.setItem('room_name',room_name);
     window.location.assign(`${CLIENT_URL}/waiting_room/${room_name}`);
   }
  });
}
catch(err)
{
    if(err.response.status===401)
    {
        localStorage.removeItem('token');
        window.location.assign(`${CLIENT_URL}/login`);
    }
}

}
const authToken=async(token)=>
{
try{
await axios.post(`${URL}/auth?token=${token}`,{});
return true;
}
catch(err)
{
if(err.response.status===401)
{   
    window.location.assign(`${CLIENT_URL}/login`);
    return false;
}
}
}

const getStatistics=async(token,userName)=>
{
 try
 {
   return await axios.get(`${URL}/statistics/${userName}`,{params:{'token':token}}).then((res)=>{
        if(res.status===200)
        {   var list_multiplayer_statis=res.data.statistic;
            var list_singleplayer_statis=res.data.single_statistic;
            var list_single_easy=list_singleplayer_statis[0];
            var list_single_medium=list_singleplayer_statis[1];
            var list_single_hard=list_singleplayer_statis[2];
            var list_single_extreme=list_singleplayer_statis[3];
            var list_solved_sudoku_easy=list_single_easy[0];
            var list_time_average_easy=list_single_easy[1];
            var list_solved_sudoku_medium=list_single_medium[0];
            var list_time_average_medium=list_single_medium[1];
            var list_solved_sudoku_hard=list_single_hard[0];
            var list_time_average_hard=list_single_hard[1];
            var list_solved_sudoku_extreme=list_single_extreme[0];
            var list_time_average_extreme=list_single_extreme[1];
            for(let i=0;i<3;i++)
            {
                localStorage.setItem(`nums_easy_${i}`,list_solved_sudoku_easy[i]);
                localStorage.setItem(`time_easy_average_${i}`,list_time_average_easy[i]);
                localStorage.setItem(`nums_medium_${i}`,list_solved_sudoku_medium[i]);
                localStorage.setItem(`time_medium_average_${i}`,list_time_average_medium[i]);
                localStorage.setItem(`nums_hard_${i}`,list_solved_sudoku_hard[i]);
                localStorage.setItem(`time_hard_average_${i}`,list_time_average_hard[i]);
                localStorage.setItem(`nums_extreme_${i}`,list_solved_sudoku_extreme[i]);
                localStorage.setItem(`time_extreme_average_${i}`,list_time_average_extreme[i]);
            }
            localStorage.setItem('easy_win',list_multiplayer_statis[0]);
            localStorage.setItem('easy_lose',list_multiplayer_statis[1]);
            localStorage.setItem('medium_win',list_multiplayer_statis[2]);
            localStorage.setItem('medium_lose',list_multiplayer_statis[3]);
            localStorage.setItem('hard_win',list_multiplayer_statis[4]);
            localStorage.setItem('hard_lose',list_multiplayer_statis[5]);
            localStorage.setItem('extreme_win',list_multiplayer_statis[6]);
            localStorage.setItem('extreme_lose',list_multiplayer_statis[7]);
            window.location.assign(`${CLIENT_URL}/statistics/${userName}`);
        }
    });
 }
 catch(err)
 {
    if(err.response.status===401 || err.response.status===404)
    {
     localStorage.removeItem('token');
     window.location.assign(`${CLIENT_URL}/login`);
    }
 }
}



const getCommentSection=async(token)=>
{

    return await axios.get(`${URL}/comment`,{params:{'token':token}}).then((res)=>
    {
    try
    {
    if(res.status===200)
    {
          window.location.assign(`${CLIENT_URL}/comment`);
    }
    }
    catch(err)
    { 
   if(err.response.status===401 || err.response.status===404)
   {
    window.location.assign(`${CLIENT_URL}/login`);
   }
    }
    });
}

const getMatch=async(token,roomName)=>
{
    try
    {
   
     return axios.get(`${URL}/match/${roomName}`,{params:{token:token}}).then((res)=>{
        if(res.status===200)
        {   
            window.location.assign(`${CLIENT_URL}/match/${res.data.room_name}`);
        }
     })
    }
    catch(err)
    {
        if(err.response.status===401)
        {
            window.location.assign(`${CLIENT_URL}/login`);
            return false;
        }
    }
}

export {addUser,getUserRegisterRes,loginUser,list,joiningRoom,userInfo,userDetail,getUserDetail,getTokenImageServer,uploadImageToServer,joiningHall,joiningLevelPicker,getWaitingRoom,authToken,getStatistics,getCommentSection,countNumsComment,postComment,getMatch};