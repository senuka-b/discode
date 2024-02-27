import React, { useCallback, useState } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, MiniMap, Controls, Background, Panel, ReactFlowProvider, MarkerType } from 'reactflow';

import 'reactflow/dist/base.css';



import DiscodeAPI from '../../api/discode';


import CommandNode from './nodes/command';
import SayNode from './nodes/say';
import Sidebar from './sidebar/sidebar';
import { useDrop } from 'react-dnd';


import TreeView from "./sidebar/treeview";
import Then from './nodes/edges/then';
import { Button } from '@mui/material';
import { HelpOutline, Refresh, Stop, Terminal } from '@mui/icons-material';


const nodeTypes = {
  command: CommandNode,
  say: SayNode
};

const edgeTypes = {
  then: Then
}

const _edges = [{ id: '1-2', source: '1', target: '2', label: 'to the', type: 'step' }];

const _nodes = [
  {
    id: '1',
    data: { label: 'Hello' },
    position: { x: 0, y: 0 },
    type: 'input',
  },
  {
    id: '2',
    data: { label: 'World' },
    position: { x: 100, y: 100 },
  },
  {
    id: '3',
    type: 'say',
    position: { x: 100, y: 100 },

  }
];

let id = 0;


const api = new DiscodeAPI();


const ProjectHome = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(_nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(_edges);
  const [reactFlowInstance, setReactFlowInstance] = React.useState(null);

  

  const onConnect = useCallback(
    (params) =>  {
      console.log("params.source ",params.source)
  
      setEdges((eds) => addEdge(
        {...params, type: 'then',
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: '#6ADFDA',
        },
        
 
        style: {
          strokeWidth: 2,
          stroke: 'rgba(120, 221, 227, 0.42)',
        },

        data: {
    
          
          "variables": params.source.includes("command") ? ["Command Context"] : 
              params.source.includes("say") ?  ["TextChannel"] : ''
        }}, eds
        
        )
        
        )}, []
    
    );


  const onDragOver = useCallback((event) => {

    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);


  const onDrop = useCallback(
    (event) => {


      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      console.log("TYPE", type)

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }


      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: type+id++,
        type,
        position,
        data: { label: `NOT IMPLEMENTED YET NODE` },
      };

      console.log("NEWNODE", newNode.id)

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance],
  );

    
    const reloadBot = (event) => {
      var data = reactFlowInstance.toObject();

      api.createNewCommand(data)
    }

  
  return (



    <ReactFlowProvider>


      <div  style={{
        height: "100vh",
        width: "100wh"
        
        
      }}>
      <ReactFlow

        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        



      >
        <Panel position='top-left' >

          <Sidebar />

        </Panel>

        <Panel position='top-right' >
          <div className='flex flex-col m-2 '>
            <div className='mb-5'>

              <Button fullWidth variant='contained' size="small" color='success' onClick={reloadBot} startIcon={<Refresh /> } >Reload bot</Button>


            </div>

            <div className='mb-5'>
              <Button fullWidth size="small" variant='contained' color='error' onClick={reloadBot} startIcon={< Stop />} >Stop bot</Button>


            </div>

            <div className='mb-5'>

              <Button size="small" variant='contained' color='secondary' onClick={reloadBot} startIcon={< Terminal />} >Open console</Button>

            </div>


            <Button size="small" variant='contained' color='info' onClick={reloadBot} startIcon={< HelpOutline />} >Help?</Button>

          </div>
          
        </Panel>

        <Background variant='dots' />
        {/* <MiniMap /> */}
        <Controls />
        
      </ReactFlow>

      </div>

  </ReactFlowProvider>





  );
};

export default ProjectHome;