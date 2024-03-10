import React, { useCallback, useState, useEffect } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, MiniMap, Controls, Background, Panel, ReactFlowProvider, MarkerType } from 'reactflow';

import 'reactflow/dist/base.css';


import DiscodeAPI from '../../api/discode';

import CommandNode from './nodes/command';
import SayNode from './nodes/say';
import Sidebar from './sidebar/sidebar';

import Then from './nodes/edges/then';
import { Button } from '@mui/material';
import { HelpOutline, Refresh, Stop, Terminal } from '@mui/icons-material';
import GetChannel from './nodes/get_channel';

import io from "socket.io-client";
const socket = io("http://localhost:5000")


const nodeTypes = {
  command: CommandNode,
  say: SayNode,
  get_channel: GetChannel
};

const edgeTypes = {
  then: Then
}

const _edges = [];

const _nodes = [

];

var id = 0;


const api = new DiscodeAPI();


const ProjectHome = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(_nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(_edges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);


  useEffect(() => {
    socket.on('error', ({ message }) => {
      console.log(message);
    });

    return () => {
      socket.off('error');
    };
  }, []);

  const onNodeDelete = useCallback((params) => {
    console.log(params, "Node deleted");
  
    setNodes((prevNodes) => {
      return prevNodes.map(element => {
        if (element.data.variables) {

          params.forEach(deleted_node => {
            element.data.variables = element.data.variables.filter(_var => _var !== deleted_node.id);
          });
        }
        return element;
      });
    });
  }, []);

  const onConnect = useCallback(
    (params) =>  {

      console.log("Source: ", params.source)
      console.log("Target: ", params.target)


      if (params.source.includes("get")) {
        setNodes((prevNodes) => {
          const target_node = prevNodes.find(node => node.id === params.target);

          if (target_node) {

            const updatedData = { ...target_node.data };
            
            updatedData.variables.push(params.source);
            
            const updatedNodes = prevNodes.map(node => {
              if (node.id === params.target) {
                return { ...node, data: updatedData };
              }
              return node;
            });
      
            return updatedNodes;
          }
          
     
          return prevNodes;
        });

      }

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
              params.source.includes("say") ?  ["TextChannel"] :
              params.source.includes("get_channel") ? ["TextChannel", ] : "",
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



      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }


      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });



      const newNode = {
        id: type.toLowerCase().replace(" ", "_")+id++,
        type: type.toLowerCase().replace(" ", "_"),
        position,

        data: { label: `NOT IMPLEMENTED YET NODE`, variables: [] },
      };

      console.log("NEWNODE", newNode.id)

      setNodes((nds) => nds.concat(newNode));

    },
    [reactFlowInstance],
  );


    const reloadBot = (event) => {
      var data = reactFlowInstance.toObject();

      console.log(data)

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
        onNodesDelete={onNodeDelete}
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