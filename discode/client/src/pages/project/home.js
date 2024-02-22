import React, { useCallback, useState } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, MiniMap, Controls, Background, Panel, ReactFlowProvider } from 'reactflow';

import 'reactflow/dist/base.css';



import DiscodeAPI from '../../api/discode';


import CommandNode from './nodes/command';
import SayNode from './nodes/say';
import Sidebar from './sidebar/sidebar';
import { useDrop } from 'react-dnd';


import TreeView from "./sidebar/treeview";


const nodeTypes = {
  command: CommandNode,
  say: SayNode
};

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
const getId = () => `dndnode_${id++}`;


const ProjectHome = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(_nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(_edges);
  const [reactFlowInstance, setReactFlowInstance] = React.useState(null);

  const onConnect = useCallback(
    (params) =>  {
      
  
      setEdges((eds) => addEdge({...params, type: 'smoothstep', label: 'Then'}, eds))}, []
    
    );


  const onDragOver = useCallback((event) => {

    console.log("HJI")

    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  let id = 0;
const getId = () => `dndnode_${id++}`;

  const onDrop = useCallback(
    (event) => {

      console.log("YOO")

      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }


      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `asdsad node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance],
  );

    
 
  
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
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        



      >
        <Panel position='top-left' >


          <Sidebar />

          



        </Panel>

        <Background variant='dots' />
        <MiniMap />
        <Controls />
        
      </ReactFlow>

      </div>

  </ReactFlowProvider>





  );
};

export default ProjectHome;