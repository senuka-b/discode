import React, { useState, useEffect, useCallback } from 'react';

import ReactFlow, { useNodesState, useEdgesState, addEdge, MiniMap, Controls, Background, Panel, ReactFlowProvider } from 'reactflow';

import { Typography } from '@mui/material';
import DiscodeAPI from '../api/discode';
import { Tree, getBackendOptions, MultiBackend } from "@minoru/react-dnd-treeview";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import CommandNode from './project/nodes/command';
import SayNode from './project/nodes/say';

const MyFlowComponent = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const api = new DiscodeAPI();

  useEffect(() => {
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
            "id": Date.now().toString(36) + Math.random().toString(36).substr(2),
            "parent": id,
            "text": component
          });
        });

        id++;
      }

      setTreeData(newData);
    });
  }, []);

  const handleDrop = useCallback((newTreeData) => {
    console.log("Tree data after drop:", newTreeData);
    // Perform any necessary actions with the dropped data
  }, []);

  const onDragStart = useCallback((event, node) => {
    console.log("Drag started:", node);
    event.dataTransfer.setData('application/reactflow', node.text);
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  const onDrop = useCallback((event) => {
    console.log("Drop event:", event);
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow');
    console.log("Dropped type:", type);
    // Logic to add new nodes to React Flow based on dropped type
  }, []);

  return (
    <div style={{height: '100vh', width: '100wh'}}>
    <DndProvider backend={MultiBackend} options={getBackendOptions()}>
      <ReactFlowProvider>
        <Panel position="left">
          <Typography style={{ userSelect: 'none' }} variant='h4' className='pb-4'>Components</Typography>
          <Tree
            enableAnimateExpand
            sort={false}
            tree={treeData}
            rootId={0}
            onDrop={handleDrop}
            onDragStart={onDragStart}
            render={(node, { depth, isOpen, onToggle }) => (
              <div style={{ marginLeft: depth * 10 }} >
                <div className={node.id === 1 ? 'bg-purple-500/10' : node.id === 2 ? 'bg-green-500/10' : node.id === 3 ? 'bg-yellow-500/10' : ''}>
                  {node.droppable && (
                    <span onClick={onToggle} >{isOpen ? "[-]" : "[+]"}</span>
                  )}
                  {node.id === 1 ? node.text : node.parent === 1 ? <SayNode onDragStart={onDragStart} /> : node.text}
                </div>
              </div>
            )}
          />
        </Panel>
        <div style={{ height: '100vh', width: 'calc(100% - 200px)', marginLeft: '200px' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onConnect={(params) => setEdges((eds) => addEdge(params, eds))}
            nodeTypes={{ command: CommandNode, say: SayNode }}
            onDrop={onDrop}
          >
            <MiniMap />
            <Controls />
            <Background variant='dots' />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </DndProvider>
    </div>
  );
};

export default MyFlowComponent;
