import { Button, Card, CardBody, CardFooter, Col, Container, Row, Table } from 'reactstrap';
import { joiningHall, joiningRoom } from '../../services/apiService/api';
import { useState,useEffect,useContext} from 'react';
import gameServices from '../../services/gameServices';
import socketService from '../../services/socketService';
import gameContext from '../../gameContext';
const Statistics=()=>
{  
   var token=localStorage.getItem('token');
   const[easyWin,setEasyWin]=useState(0);
   const[easyLose,setEasyLose]=useState(0);
   const[mediumWin,setMediumWin]=useState(0);
   const[mediumLose,setMediumLose]=useState(0);
   const[hardWin,setHardWin]=useState(0);
   const[hardLose,setHardLose]=useState(0);
   const[extremeWin,setExtremeWin]=useState(0);
   const[extremeLose,setExtremeLose]=useState(0);
   const[easyNumsStatistic,setEasyNumsStatistic]=useState([]);
   const[easyTimeStatistic,setEasyTimeStatistic]=useState([]);
   const[mediumNumsStatistic,setMediumNumsStatistic]=useState([]);
   const[mediumTimeStatistic,setMediumTimeStatistic]=useState([]);
   const[hardNumsStatistic,setHardNumsStatistic]=useState([]);
   const[hardTimeStatistic,setHardTimeStatistic]=useState([]);
   const[extremeNumsStatistic,setExtremeNumsStatistic]=useState([]);
   const[extremeTimeStatistic,setExtremeTimeStatistic]=useState([]);
   const delay=ms=>new Promise(rs=>setTimeout(rs,ms));

   const prevPage=async()=>
 {
    var token_object={token:token};
    await joiningHall(token_object);
 } 
 useEffect(()=>{
       var easy_win=parseInt(localStorage.getItem('easy_win'));
       
       var easy_lose=parseInt(localStorage.getItem('easy_lose'));
       
       var medium_win=parseInt(localStorage.getItem('medium_win'));
       
       var medium_lose=parseInt(localStorage.getItem('medium_lose'));
       
       var hard_win=parseInt(localStorage.getItem('hard_win'));
       
       var hard_lose=parseInt(localStorage.getItem('hard_lose'));
       
       var extreme_win=parseInt(localStorage.getItem('extreme_win'));
       
       var extreme_lose=parseInt(localStorage.getItem('extreme_lose'));
    
       var list_easy_nums=[];
       var list_easy_time_average=[];
       var list_medium_nums=[];
       var list_medium_time_average=[];
       var list_hard_nums=[];
       var list_hard_time_average=[];
       var list_extreme_nums=[];
       var list_extreme_time_average=[];
       for(let i=0;i<3;i++)
       {
        list_easy_nums.push(localStorage.getItem(`nums_easy_${i}`));
        list_easy_time_average.push(localStorage.getItem(`time_easy_average_${i}`));
        list_medium_nums.push(localStorage.getItem(`nums_medium_${i}`));
        list_medium_time_average.push(localStorage.getItem(`time_medium_average_${i}`));
        list_hard_nums.push(localStorage.getItem(`nums_hard_${i}`));
        list_hard_time_average.push(localStorage.getItem(`time_hard_average_${i}`));
        list_extreme_nums.push(localStorage.getItem(`nums_extreme_${i}`));
        list_extreme_time_average.push(localStorage.getItem(`time_extreme_average_${i}`));
       }
       setEasyWin(easy_win);
       setEasyLose(easy_lose);   
       setMediumWin(medium_win);
       setMediumLose(medium_lose);
       setHardWin(hard_win);
       setHardLose(hard_lose);
       setExtremeWin(extreme_win);
       setExtremeLose(extreme_lose);
       setEasyNumsStatistic(list_easy_nums);
       setEasyTimeStatistic(list_easy_time_average);
       setMediumNumsStatistic(list_medium_nums);
       setMediumTimeStatistic(list_medium_time_average);
       setHardNumsStatistic(list_hard_nums);
       setHardTimeStatistic(list_hard_time_average);
       setExtremeNumsStatistic(list_extreme_nums);
       setExtremeTimeStatistic(list_extreme_time_average);
 },[]);

return(
<div>
<Row>
<Col md={{size:200,offset:1}}>
<Card className='mt-3 border-0 rounded-0 shadow-sm' >
    <CardBody>
        <h3 style={{textAlign:'center'}}>Thống kê thành tích Multiplayer</h3>
        <Table responsive striped hover bordered={true} border-spacing='0' width="100%" className='text-center mt-5'>
        <thead>
            <tr>
                <th>Độ khó</th>
                <th>Thắng</th>
                <th>Thua</th>
            </tr>
        </thead>
        <tbody>
        <tr>
            <td>Easy</td>
            <td>{easyWin}</td>
            <td>{easyLose}</td>
        </tr>
       
        <tr>
            <td>Medium</td>
            <td>{mediumWin}</td>
            <td>{mediumLose}</td>
        </tr> 
        
        <tr>
            <td>Hard</td>
            
            <td>{hardWin}</td>
            
            <td>{hardLose}</td>
        </tr>
        <tr>
            <td>Extreme</td>
            
            <td>{extremeWin}</td>
            
            <td>{extremeLose}</td>
        </tr>
        </tbody>    
        </Table>
    </CardBody>
 
</Card>
</Col>
</Row>
<Row>
<Col md={{size:200,offset:1}}>
<Card className='mt-3 border-0 rounded-0 shadow-sm' style={{width:600}}>
    <CardBody>
    <h3 style={{textAlign:'center'}}>Thống kê thành tích cá nhân</h3>
    <Table responsive striped hover bordered={true} className='text-center mt-5'>
    <thead>
        <tr>
            <th>Độ khó</th>
            <th></th>
            <th>7 ngày gần nhất</th>
            <th>30 ngày gần nhất</th>
            <th>Tổng thời gian</th>
        </tr>
    </thead>
    <tbody>
        <tr>
        <td rowSpan={2} style={{verticalAlign:'middle',textAlign:'center'}}>Easy</td>
        <td>Sudoku đã giải</td>
        <td>{easyNumsStatistic.map((item)=>{var val=item.split('-');if(val[0]==='7'){return val[1];}})}</td>
        <td>{easyNumsStatistic.map((item)=>{var val=item.split('-');if(val[0]==='30'){return val[1];}})}</td>
        <td>{easyNumsStatistic.map((item)=>{var val=item.split('-');if(val[0]==='all'){return val[1];}})}</td>
        </tr>
        <tr>
           <td>Thời gian trung bình</td>
           <td>{easyTimeStatistic.map((item)=>{var val=item.split('.');if(val[0]==='7'){return val[1];}})}</td>
           <td>{easyTimeStatistic.map((item)=>{var val=item.split('.');if(val[0]==='30'){return val[1];}})}</td>
           <td>{easyTimeStatistic.map((item)=>{var val=item.split('.');if(val[0]==='all'){return val[1];}})}</td>
        </tr>
        <tr>
        <td rowSpan={2} style={{verticalAlign:'middle',textAlign:'center'}}>Medium</td>
        <td>Sudoku đã giải</td>
        <td>{mediumNumsStatistic.map((item)=>{var val=item.split('-');if(val[0]==='7'){return val[1];}})}</td>
        <td>{mediumNumsStatistic.map((item)=>{var val=item.split('-');if(val[0]==='30'){return val[1];}})}</td>
        <td>{mediumNumsStatistic.map((item)=>{var val=item.split('-');if(val[0]==='all'){return val[1];}})}</td>
        </tr>
        <tr>
           <td>Thời gian trung bình</td>
           <td>{mediumTimeStatistic.map((item)=>{var val=item.split('.');if(val[0]==='7'){return val[1];}})}</td>
           <td>{mediumTimeStatistic.map((item)=>{var val=item.split('.');if(val[0]==='30'){return val[1];}})}</td>
           <td>{mediumTimeStatistic.map((item)=>{var val=item.split('.');if(val[0]==='all'){return val[1];}})}</td>
        </tr>
        <tr>
        <td rowSpan={2} style={{verticalAlign:'middle',textAlign:'center'}}>Hard</td>
        <td>Sudoku đã giải</td>
        <td>{hardNumsStatistic.map((item)=>{var val=item.split('-');if(val[0]==='7'){return val[1];}})}</td>
        <td>{hardNumsStatistic.map((item)=>{var val=item.split('-');if(val[0]==='30'){return val[1];}})}</td>
        <td>{hardNumsStatistic.map((item)=>{var val=item.split('-');if(val[0]==='all'){return val[1];}})}</td>
        </tr>
        <tr>
           <td>Thời gian trung bình</td>
           <td>{hardTimeStatistic.map((item)=>{var val=item.split('.');if(val[0]==='7'){return val[1];}})}</td>
           <td>{hardTimeStatistic.map((item)=>{var val=item.split('.');if(val[0]==='30'){return val[1];}})}</td>
           <td>{hardTimeStatistic.map((item)=>{var val=item.split('.');if(val[0]==='all'){return val[1];}})}</td>
        </tr>
        <tr>
        <td rowSpan={2} style={{verticalAlign:'middle',textAlign:'center'}}>Extreme</td>
        <td>Sudoku đã giải</td>
        <td>{extremeNumsStatistic.map((item)=>{var val=item.split('-');if(val[0]==='7'){return val[1];}})}</td>
        <td>{extremeNumsStatistic.map((item)=>{var val=item.split('-');if(val[0]==='30'){return val[1];}})}</td>
        <td>{extremeNumsStatistic.map((item)=>{var val=item.split('-');if(val[0]==='all'){return val[1];}})}</td>
        </tr>
        <tr>
           <td>Thời gian trung bình</td>
           <td>{extremeTimeStatistic.map((item)=>{var val=item.split('.');if(val[0]==='7'){return val[1];}})}</td>
           <td>{extremeTimeStatistic.map((item)=>{var val=item.split('.');if(val[0]==='30'){return val[1];}})}</td>
           <td>{extremeTimeStatistic.map((item)=>{var val=item.split('.');if(val[0]==='all'){return val[1];}})}</td>
        </tr>
    </tbody>
    </Table>
    </CardBody>
    </Card>
</Col>
</Row>
<div className='mt-3 text-center' style={{marginLeft:'150px'}}>
<Button color="primary" onClick={prevPage}>Quay lại</Button>
</div>
</div>);
};
export default Statistics;