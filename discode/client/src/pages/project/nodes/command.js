import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

import {Box, Divider, FormControl, IconButton, InputLabel, MenuItem, Select, TextField} from '@mui/material/';
import {Add} from '@mui/icons-material';
import { pink } from '@mui/material/colors';

import { v4 as uuidv4 } from 'uuid';


function ParameterComponent() {
    const [paramType, setParamType] = React.useState('');

    const handleChange = (event) => {
        setParamType(event.target.value);
      };


    return  <div key = {uuidv4} className='items-start mt-2 flex justify-between'>
    <TextField  label="Parameter name" InputLabelProps={{style: { color: 'white', opacity: '70%',  paddingTop: 2}, }} inputProps={{style: { color: 'white',}}} variant="filled" className='rounded-md nodrag h-1' error={false} helperText="" required size="small" sx={{width:160}} />

                
    <div className='flex-grow ml-5'>

        <FormControl required  fullWidth  variant='filled' >
            <InputLabel id="parameter-type-label" style={{color: "white", opacity: "70%", }}>Parameter type</InputLabel>

            <Select labelId='parameter-type-label' value={paramType} onChange={handleChange}   className='nodrag ' defaultValue={'member'} sx={{color: 'yellow', height: 47}} color="success" MenuProps={{
                 PaperProps: {
                    style: {
                    backgroundColor: pink[100], 
                    },
                },}} >
                <MenuItem value={1}>Member</MenuItem>
                <MenuItem value={2}>Channel</MenuItem>
                <MenuItem value={3}>Text</MenuItem>
                <MenuItem value={4}>Number</MenuItem>

                // Fetch from API 
                

            </Select>
        </FormControl>
    </div>


    </div>
}


function CommandNode({ data }) {
 const [parameters, setParameters] = React.useState([])

  

  const handleCreateParameter = (event) => {
    const param = <ParameterComponent />
    

    
    setParameters([...parameters, param]);
  }

  return (
   
    <div className='box-animated  '>
        <div className="px-4 py-2 shadow-md rounded-md bg-purple-950 size-auto p ">
        <div className="flex">
            <div className="rounded-full w-12 h-12 flex justify-center items-center bg-slate-600 text-cyan-400 text-2">
            {"</>"}
            </div>
            <div className="ml-2 mt-1 p-3">
                <div className="text-lg font-bold">Command</div>
                <div className="text-gray-500 mt-3">
                    <TextField  label="Command name" InputLabelProps={{style: { color: 'white', opacity: '70%' }, }} inputProps={{style: { color: 'white'}}} variant="filled" className='rounded-md nodrag ' error={false} helperText="" required size="small"/>
                    

                </div>
                <div className='mt-2 w-96'>
                    <TextField  label="Description" fullWidth multiline InputLabelProps={{style: { color: 'white', opacity: '70%' }, }} inputProps={{style: { color: 'white'}}} variant="filled" className='rounded-md nodrag mx-6 w-1' helperText="" size="small"/>

                </div>

                <div className='items-start mt-3 flex justify-between'>
                    <div className='text-left text-base font-semibold mt-1'>Parameters</div>
                    <IconButton aria-label='create parameter' sx={{color: pink[500]}} onClick={handleCreateParameter}>
                        <Add />
                    </IconButton>
                </div>

                <div>
                    {parameters.length !== 0 ? parameters : "You don't have any parameters added!"}

                </div>


            </div>
            
        </div>

        <Handle type="target" position={Position.Top} className="w-16 !bg-teal-500" />
        <Handle type="source" position={Position.Bottom} className="w-16 !bg-teal-500" />
        </div>
    </div>

  );
}

export default memo(CommandNode);
