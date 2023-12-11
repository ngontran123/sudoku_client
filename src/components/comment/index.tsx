import { useState,useEffect } from "react";
import { Card, CardBody, CardFooter, Col, Container, Row, Table} from 'reactstrap';
import ProgressBar from "../progress_bar";
import { postComment,countNumsComment} from "../../services/apiService/api";
import { type } from '@testing-library/user-event/dist/type';
import { authToken } from "../../services/apiService/api";
import { error } from "console";
import LoadingSpinnerVal from "../LoadingSpinner";
import { AlertErrorDialog } from "../dialogbox";
const CommentSection=()=>
{
    const[comment,setComment]=useState('');
    const [numComment,setNumComment]=useState(0);
    const [positiveComment,setPositiveComment]=useState(0);
    const [negativeComment,setNegativeComment]=useState(0);
    const [loading,setLoading]=useState(false);
    var token=localStorage.getItem('token');
    var current_user=JSON.parse(localStorage.getItem('current_user'));
    
    var submitCommentForm=async(e)=>
    {
 
    e.preventDefault();
  try
  {
    setLoading(true);
    var username=current_user.username;
    var data={'comment':comment,'username':username};
    if(comment==="" || comment==null)
    {
        AlertErrorDialog("Không được gửi comment rỗng","Comment không có nội dung");
        return;
    }
    await postComment(token,data);
  }
  finally
  {
    setLoading(false);
  }
    }

    var onChangeTextArea=(e)=>{
        setComment(e.target.value);
    } 

    useEffect(()=>{
           var countCommentHandling=async()=>{
           var list_nums=await countNumsComment(token);
           var count_all_comment=list_nums[0];
           var count_positive_comment=list_nums[1];
           var count_negative_comment=list_nums[2];
           var percen_positive=(count_positive_comment/count_all_comment)*100;
           var percen_negative=(count_negative_comment/count_all_comment)*100;
           setNumComment(count_all_comment);
           setPositiveComment(Math.round(percen_positive));
           setNegativeComment(Math.round(percen_negative));
        }
        countCommentHandling().catch(console.error);
    },[]);
  
 return(

    <div>
    <Row>
<Col md={{size:200,offset:1}}>
<Card className='mt-3 border-0 rounded-0 shadow-sm' >
    <CardBody>
   <div className="comment-flex-box">
   <h3 className="review-text">Đánh giá tổng quan</h3>
    <p className="all-review">Tổng số đánh giá:(<strong>{numComment}</strong>)</p>
    <ul className="progress-emoji">
    <li className="progess-width">
    <div className="emoji">&#128512;</div><ProgressBar percen={positiveComment}></ProgressBar>
    </li>

    <li className="progess-width">
    <div className="emoji">&#128545;</div><ProgressBar percen={negativeComment}></ProgressBar>
    </li>
    
    </ul>  
    </div>
    </CardBody>
    </Card>
    </Col>
    </Row>
    <Row>
<Col md={{size:200,offset:1}}>
<Card className='mt-3 border-0 rounded-0 shadow-sm' >
    <CardBody>
    <div className="comment-flex-box">
    <h3 className="comment-text">
        Nhận xét của bạn:
     </h3>
        <textarea className="text-box" onChange={onChangeTextArea}></textarea>
        <button onClick={submitCommentForm} type='submit' className="comment-btn">Submit</button>
        {loading && <LoadingSpinnerVal/>}
        </div>
    </CardBody>
    </Card>
    </Col>
    </Row>
    </div>
 );
};

export default CommentSection;