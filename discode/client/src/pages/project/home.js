import React, { useCallback, useState } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, MiniMap, Controls, Background, Panel, ReactFlowProvider } from 'reactflow';

import 'reactflow/dist/base.css';

import {
  Tree,
  getBackendOptions,
  MultiBackend,
} from "@minoru/react-dnd-treeview";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";


import DiscodeAPI from '../../api/discode';
import { Typography } from '@mui/material';



import CommandNode from './nodes/command';
import SayNode from './nodes/say';
import Sidebar from './sidebar/sidebar';

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

  const onDrop = useCallback(
    (event) => {

      console.log("YOO")

      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid

      console.log(type);

      if (typeof type === 'undefined' || !type) {
        return;
      }

      // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance],
  );

    
  const api = new DiscodeAPI()

 
  React.useEffect(() => {
      api.fetchComponents().then((value) => {
        value = new Map(Object.entries(value));

        var newData = [];
        var id = 1;

        for (const [componentType, components] of value.entries()) {
          newData.push({
            "id": id,
            "parent": 0,
            "text": componentType,
            "droppable": true
          });

          

          components.forEach(component => {
            newData.push({
              "id": Date.now().toString(36) + Math.random().toString(36).substr(2), // I don't know what i'm doing
              "parent": id,
              "text": component
            });


          });

          id++;



        }

        console.log(newData)

        setTreeData(newData);
      });
    }, []);
  

  



  const [treeData, setTreeData] = useState([]);

  return (

    


    <ReactFlowProvider>
    <DndProvider backend={MultiBackend} options={getBackendOptions()} >

      <div style={{
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
        <Panel position='top-left'>


        <Tree
          enableAnimateExpand

          sort={false}
          tree={treeData}
          rootId={0}
          onDrop={(newTree) => {
            // setTreeData(newTree)
          } }
          
          onDragStart={(node, monitor) => {

          }}

          render={(node, { depth, isOpen, onToggle }) => (
            <div style={{ marginLeft: depth * 10}}  >
              <div className={
                node.id === 1   ? 'bg-purple-500/10' : 
                node.id === 2 ? 'bg-green-500/10' :
                node.id === 3 ? 'bg-yellow-500/10' :
                ''
            
            }>
                {node.droppable && (
                  <span onClick={onToggle} >{isOpen ? "[-]" : "[+]"}</span>
                )}
                {node.id === 1 ? node.text : node.parent === 1 ? <SayNode  /> : node.text}
              </div>
            </div>
          )}
        />



        </Panel>

        <Background variant='dots' />
        <MiniMap />
        <Controls />
        
      </ReactFlow>

      </div>
      </DndProvider >

  </ReactFlowProvider>

  );
};

export default ProjectHome;