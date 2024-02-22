import { TextField } from '@mui/material';
import React from 'react';



const SayNode = ({onDragStart}) => {


    return ( 

        <div  >
        <div  className="px-2 py-2 shadow-md rounded-md bg-pink-950 size-auto my-4">
             <div className="ml-1  mt-1 ">
                <div className="text-lg font-bold">Say</div>
                <div className="text-gray-500 mt-3" style={{fontSize:12}}>required object: <em>channel</em></div>


                <TextField  label="Text" InputLabelProps={{style: { color: 'white', opacity: '70%' }, }} inputProps={{style: { color: 'white'}}} variant="filled" className='rounded-md noDrag ' error={false} helperText="" required size="small"/>


            </div>

        </div>
        </div>
     );
}
 
export default SayNode;
