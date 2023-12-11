import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { ProgressBar } from 'react-bootstrap';
const ProgressBarVal=(prop)=>
{
        // Green color for the progress bar
      return(
      <div>
        <ProgressBar animated now={prop.percen} label={`${prop.percen}%`}></ProgressBar> 
      </div>
      );
};
export default ProgressBarVal;