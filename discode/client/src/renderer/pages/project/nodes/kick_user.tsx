import { TextField } from '@mui/material';
import React, {useState, useRef, useEffect} from 'react';
import { Handle, Node, Position } from 'reactflow';



const KickUser = ({data, id}: {data: any, id: string}) => {

    const [text, setText] = useState(data['text'])
    const [reason, setReason] = useState('')

    useEffect(() => {

        setText(data.text);
        setReason(data.reason);

    }, [])



    return (

        <div  >

        {/* <NodeResizer color="#ff0071" isVisible={selected} minWidth={150} minHeight={maxHeight}  maxHeight={maxHeight}/> */}
        <div    className="px-2 shadow-md rounded-md bg-rose-950 py-4 mr-40  size-full">
             <div className="ml-1  mt-1 ">
                <div className="text-lg font-bold">Kick user</div>
                <div className="text-gray-500 mt-3" style={{fontSize:12}}>required object: <em>Member</em></div>
                <div className="text-gray-500 mt-3" style={{fontSize:9}}>You can pass in an ID or name of the member</div>



                <TextField onChange={(event) => {

                    setText(event.target.value);

                    data.setNodes((prev_nodes: Node[]) => prev_nodes.map((node) => {
                        if (node.id === id) {
                            return {...node, data: {...node.data, text: event.target.value}}
                        }

                        return node;
                    }))




                }} fullWidth value={text} label="Member"  InputLabelProps={{style: { color: 'white', opacity: '70%' }, }} inputProps={{style: { color: 'white'}, }}  variant="filled" className='rounded-md nodrag ' error={false} helperText="" required size="small"/>


                <div className="text-gray-500 mt-3" style={{fontSize:9}}>Enter a reason to kick the user</div>


                <TextField onChange={(event) => {

                    setReason(event.target.value);

                    data.setNodes((prev_nodes: Node[]) => prev_nodes.map((node) => {
                        if (node.id === id) {
                            return {...node, data: {...node.data, reason: event.target.value}}
                        }

                        return node;
                    }))




                }} fullWidth value={reason} multiline label="Reason"  InputLabelProps={{style: { color: 'white', opacity: '70%' }, }} inputProps={{style: { color: 'white'}, }}  variant="filled" className='rounded-md nodrag ' error={false} helperText="" required size="small"/>


            </div>


            <Handle type="target" position={Position.Top} className="w-7 h-4 rounded-lg !bg-green-500 opacity-60" />
            <Handle type="source" position={Position.Right} className="w-5 h-7 rounded-lg !bg-green-500 opacity-60" />





        </div>
        </div>
     );
}

export default KickUser;
