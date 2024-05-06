import { TextField } from '@mui/material';
import React, {useState, useRef, useEffect} from 'react';
import { Handle, Node, Position } from 'reactflow';

const PrintNode = ({data, id}: {data: any, id: string}) => {

    const [text, setText] = useState(data['text'])


    if (data.text !== text) {
        setText(data.text);
      }

    return (

        <div  >

        {/* <NodeResizer color="#ff0071" isVisible={selected} minWidth={150} minHeight={maxHeight}  maxHeight={maxHeight}/> */}
        <div    className="px-2 shadow-md rounded-md bg-yellow-950 py-4 mr-40  size-full">
             <div className="ml-1  mt-1 ">
                <div className="text-lg font-bold">Print</div>
                <div className="text-gray-500 mt-3" style={{fontSize:12}}>Prints something in the console.</div>


                <TextField onChange={(event) => {

                    setText(event.target.value);

                    data.setNodes((prev_nodes: Node[]) => prev_nodes.map((node) => {
                        if (node.id === id) {
                            return {...node, data: {...node.data, text: event.target.value}}
                        }

                        return node;
                    }))




                }} fullWidth value={text} multiline label="Any"  InputLabelProps={{style: { color: 'white', opacity: '70%' }, }} inputProps={{style: { color: 'white'}, }}  variant="filled" className='rounded-md nodrag ' error={false} helperText="" required size="small"/>


            </div>


            <Handle type="target" position={Position.Top} className="w-7 h-4 rounded-lg !bg-green-500 opacity-60" />
            <Handle type="source" position={Position.Right} className="w-5 h-7 rounded-lg !bg-green-500 opacity-60" />





        </div>
        </div>
     );
}

export default PrintNode;
