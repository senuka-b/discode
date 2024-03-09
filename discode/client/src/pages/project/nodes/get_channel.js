import { TextField } from '@mui/material';
import React, {useState,} from 'react';
import { Handle, Position } from 'reactflow';



const GetChannel = ({data, selected}) => {

    const [text, setText] = useState(data['text'])

  
    return ( 

        <div  >

  
        <div    className="px-2 shadow-md rounded-md bg-yellow-950 py-4 mr-40  size-full">
             <div className="ml-1  mt-1 ">
                <div className="text-base font-bold">Get channel</div>
                <div className="text-gray-500 mt-3" style={{fontSize:12}}>required object: <em>CommandContext</em></div>

                <div className="text-gray-500 mt-3" style={{fontSize:9}}>You can pass in an ID or name of the channel</div>



                <TextField onChange={(event) => {

                    setText(event.target.value);

                    data['text'] = text;
            
         

                }} fullWidth value={text} multiline label="Channel"  InputLabelProps={{style: { color: 'white', opacity: '70%' }, }} inputProps={{style: { color: 'white'}, }}  variant="filled" className='rounded-md nodrag ' error={false} helperText="" required size="small"/>


            </div>

        
            <Handle type="target" position={Position.Top} className="w-7 h-4 rounded-lg !bg-green-500 opacity-60" />
            <Handle type="source" position={Position.Right} className="w-5 h-7 rounded-lg !bg-green-500 opacity-60" />





        </div>
        </div>
     );
}
 
export default GetChannel;
