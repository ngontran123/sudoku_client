import React from 'react';
import { BeatLoader } from 'react-spinners';
const LoadingSpinnerVal=()=>
{
 return(
  <div className='loading-spinner-overlay'>
   <div className='loading-spinner'>
    <BeatLoader size={20} color="#36D7B7"/>
   </div>
   </div>
 );
};

export default LoadingSpinnerVal;