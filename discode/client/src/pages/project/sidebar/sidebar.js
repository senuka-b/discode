import React from 'react';
import { useState } from "react";
import {
  Tree,
  getBackendOptions,
  MultiBackend,
} from "@minoru/react-dnd-treeview";

import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { Typography } from '@mui/material';
import DiscodeAPI from '../../../api/discode';
import SayNode from '../nodes/say';

export default () => {
  const onDragStart = (event, node) => {
    
      console.log("yo1")
  
  
      event.dataTransfer.setData('application/reactflow', 'say');
      event.dataTransfer.effectAllowed = 'move';

  }
  
 
  


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
  const handleDrop = (newTreeData) => {
    console.log("DROPPED  ");
  };

  return (

    <>

      <Typography style={{userSelect: 'none'}} variant='h4' className='pb-4'>Components</Typography>
        <Tree
          enableAnimateExpand
          sort={false}
          tree={treeData}
          rootId={0}
          onDrop={handleDrop}
          
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
                {node.id === 1 ? node.text : node.parent === 1 ? <SayNode onDragStart={(event) => onDragStart(event, 'say')} /> : node.text}
              </div>
            </div>
          )}
        />


  
    </>
  );
};
