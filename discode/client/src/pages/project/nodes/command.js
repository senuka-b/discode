import React, { memo, useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';

import {Box, Checkbox, Divider, FormControl, IconButton, InputLabel, MenuItem, Select, TextField} from '@mui/material/';
import {Add} from '@mui/icons-material';
import { pink } from '@mui/material/colors';

import { v4 as uuidv4 } from 'uuid';


function ParameterComponent({data, index,}) {
    const [paramName, setparamName] = useState('')
    const [paramType, setParamType] = useState('');
    const [required, setRequired] = useState(false);


    const handleParamTypeChange = (event) => {
        setParamType(event.target.value);
      };

    const handleParamNameChange = (event) => {
        setparamName(event.target.value)
    }

    const handleRequiredChange = (event) => {
        setRequired((is_checked) => !is_checked);
    }
     

    useEffect(() => {
        data["parameters"][index] = { paramName, paramType, required };

   
    }, [paramName, paramType, required]);



    return  <div key = {uuidv4} className='items-start mt-2 flex justify-between'>
    <TextField  label="Parameter name" onChange={handleParamNameChange} value={paramName} InputLabelProps={{style: { color: 'white', opacity: '70%',  paddingTop: 2}, }} inputProps={{style: { color: 'white',}}} variant="filled" className='rounded-md nodrag h-1' error={false} helperText="" required size="small" sx={{width:160}} />

                
    <div className='flex-grow ml-5'>

        <FormControl required  fullWidth  variant='filled' >
            <InputLabel id="parameter-type-label" style={{color: "white", opacity: "70%", }}>Parameter type</InputLabel>

            <Select labelId='parameter-type-label' value={paramType} onChange={handleParamTypeChange}   className='nodrag ' defaultValue={'member'} sx={{color: 'yellow', height: 47}} color="success" MenuProps={{
                 PaperProps: {
                    style: {
                    backgroundColor: pink[100], 
                    },
                },}} >

                <MenuItem value={1}>Member</MenuItem>
                <MenuItem value={2}>TextChannel</MenuItem>
                <MenuItem value={3}>Text</MenuItem>
                <MenuItem value={4}>Number</MenuItem>
                <MenuItem value={5}>Role</MenuItem>
                <MenuItem value={6}>Server</MenuItem>
                <MenuItem value={7}>User</MenuItem>

                

            </Select>



        </FormControl>







    </div>

        <Checkbox title='Required?'  sx={{
            color: pink[800],
            '&.Mui-checked': {
            color: pink[600],
            },

            
        }} onChange={handleRequiredChange}
            checked={required}/>

    





    </div>
}


function CommandNode({ data }) {
 const [parameters, setParameters] = React.useState([])

 const [command_name, setCommand_name] = useState(data['command_name'])
 const [description, setDescription] = useState(data['description'])


  

  const handleCreateParameter = (event) => {


    data["parameters"].push(
        {
            paramName: "",
            paramType: "",
            required: false
        }
    )

    const param = <ParameterComponent 
        data={data}
        index={parameters.length}

    />



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
                    <TextField onChange={(event) => {data['command_name'] = event.target.value; setCommand_name(event.target.value)}}  value={command_name} label="Command name" InputLabelProps={{style: { color: 'white', opacity: '70%' }, }} inputProps={{style: { color: 'white'}}} variant="filled" className='rounded-md nodrag ' error={false} helperText="" required size="small"/>
                    

                </div>
                <div className='mt-2 w-96'>
                    <TextField onChange={(event) => {data['description'] = event.target.value; setDescription(event.target.value)}} value={description} label="Description" fullWidth multiline InputLabelProps={{style: { color: 'white', opacity: '70%' }, }} inputProps={{style: { color: 'white'}}} variant="filled" className='rounded-md nodrag mx-6 w-1' helperText="" size="small"/>

                </div>

                <div className='items-start mt-3 flex justify-between'>
                    <div className='text-left text-base font-semibold mt-1'>Parameters</div>
                    <IconButton aria-label='create parameter' sx={{color: pink[500]}} onClick={handleCreateParameter}>
                        <Add />
                    </IconButton>
                </div>

                <div >
                    {parameters.length !== 0 ? parameters : "You don't have any parameters added!"}
                    
      
                </div>
                 

                   


                </div>




            </div>
            
        </div>

    
        <Handle type="target" position={Position.Top} className="w-7 h-4 rounded-lg !bg-orange-500 opacity-60" />

        <p style={{color: "white", opacity: "100%", fontsize: 16, position: 'absolute', top: -30, left: 225,  backgroundColor: "rgba(249,115, 22, 0.5)"} } className='font-thin rounded-md'>Checks</p>
       
        <Handle type="source"  id="b" position={Position.Right} className="w-4 h-7 rounded-lg !bg-green-500 opacity-60" />

        <p style={{color: "white", opacity: "100%", fontsize: 16, position: 'absolute', top: "46.5%", left: "98.7%",  backgroundColor: "rgba(34, 197, 94, 0.5)", transform: 'rotate(90deg)'} } className='font-thin rounded-md'>Actions</p>


        {/* {paramHandles.map((item, index) => (

        ))} */}

    
        </div>


  );
}

export default memo(CommandNode);
