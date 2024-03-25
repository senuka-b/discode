import React, { useCallback, useState, useEffect } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, MiniMap, Controls, Background, Panel, ReactFlowProvider, MarkerType, useReactFlow } from 'reactflow';

import { useSnackbar } from 'notistack';

import 'reactflow/dist/base.css';


import DiscodeAPI from '../../api/discode';

import CommandNode from './nodes/command';
import SayNode from './nodes/say';
import Sidebar from './sidebar/sidebar';

import Then from './nodes/edges/then';
import { Box, Button, IconButton, Stack, Tab, Tabs } from '@mui/material';
import { Add, HelpOutline, Refresh, Stop, Terminal } from '@mui/icons-material';
import GetChannel from './nodes/get_channel';

import io from "socket.io-client";
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import CreateExtension from './dialogs/create_extension';
import RenameExtension from './dialogs/rename_extension';



const socket = io("http://localhost:5000")


const nodeTypes = {
  command: CommandNode,
  say: SayNode,
  get_channel: GetChannel
};

const edgeTypes = {
  then: Then
}




const api = new DiscodeAPI();


const ProjectHomeComponent = () => {

  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const { setViewport } = useReactFlow();
  const [extensionValue, setextensionValue] = useState(0);


  const [dialogCreatExtensionOpen, setDialogCreateExtensionOpen] = useState(false);
  const [dialogRenameExtensionOpen, setDialogRenameExtensionOpen] = useState(false);
  const [rightClickedExtension, setrightClickedExtension] = useState('')

  const [extensions, setExtensions] = useState([]);

  const {state} = useLocation();

  console.log("State", state)

  var path = state.path;
  var project_name = state.project_name;

  useEffect(() => {
    
    console.log("Fetching project data")


    api.getProject(state.path).then((value) => {
      console.log("Fetched projetc data")

      setExtensions(value["extensions"])



      switch_extension(value["extensions"][0])
      
    })


  }, [])
  

  const switch_extension = (extension_name) => {
    api.getExtension(state.path, extension_name).then((value) => {


        setNodes(value.nodes);

        setEdges(value.edges);

        



        setTimeout(() => {
          if (reactFlowInstance) {

            console.log("yip")
            reactFlowInstance.fitView({padding: 0.2});

          } else {
          }
        }, 1);

       
        // setViewport(value.viewport,);
    })
  }


  const { enqueueSnackbar } = useSnackbar();


  useEffect(() => {
    socket.on('error', ({ message }) => {

      console.log("ERROR:", message);

      enqueueSnackbar(message,  {variant: "error", anchorOrigin: {horizontal: "right", vertical: "bottom"}} );
    });

    return () => {
      socket.off('error');
    };
  }, []);

  
  

  const onNodeDelete = useCallback((params) => {
  
    setNodes((prevNodes) => {
      var nodes = prevNodes.map(element => {
        if (element.data.variables) {

          params.forEach(deleted_node => {
            element.data.variables = element.data.variables.filter(_var => _var !== deleted_node.id);
          });
        }


        return element;
      }).filter((n) =>  !params.some((deleted_node) => deleted_node.id === n.id));

    
    console.log("_nodes", nodes)
    return nodes
    }
    
    );



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
              params.source.includes("say") ?  ["TextChannel", "Message"] :
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
        id: type.toLowerCase().replace(" ", "_")+uuidv4(),
        type: type.toLowerCase().replace(" ", "_"),
        position,

        data: { label: `NOT IMPLEMENTED YET NODE`, variables: [], parameters: [] },
      };

      console.log("NEWNODE", newNode.id)

      setNodes((nds) => nds.concat(newNode));

    },
    [reactFlowInstance],
  );


  const reloadBot = (event) => {
   

    api.reloadCommands(path, project_name);

    enqueueSnackbar("Bot reloaded successfully", {variant: "success", autoHideDuration: 2000, anchorOrigin: {horizontal: "center", vertical: "bottom"}})
  }

  const openDocumentation = () => {
    window.electron_.openDocumentation.open();
  }

  const openConsole = () => {
    window.electron_.openConsole();
  }
   

   


  // const stopBot = (event) => {
  //   console.log("Stopping bot..")

  //   api.stopBot().then((value) => {
  //     enqueueSnackbar(value === 'running' ? "Bot is not running" : "Bot shutdown successfully", {variant: value === 'running' ? "error" : "success", autoHideDuration: 2000, anchorOrigin: {horizontal: "center", vertical: "bottom"}})
      
  //   })
  // }

 

  const handleAutoSave = useCallback((event) => {
   
    setTimeout(() => {
      if (!reactFlowInstance) {return}


      let data = reactFlowInstance.toObject();



      console.log("REACTFLOW", data)
      console.log("nodes", nodes)
  
      socket.emit("auto-save", {
        path,
        name: extensions[extensionValue],
        node_data: data
      })
    }, 100);

   
  }, [nodes, edges])

  
  useEffect(() => {
    handleAutoSave();
  }, [nodes, handleAutoSave, edges]);


  const handleExtensionClick = (event, extension) => {
    switch_extension(extension);

  }


  const handleExtensionRename = (extension) => {
    setrightClickedExtension(extension);
    setDialogRenameExtensionOpen(true);

  }

  const handleDialogRenameExtension = (extension, renamed_extension, is_deleted) => {
    setDialogRenameExtensionOpen(false);

    if (is_deleted === true) {
      setExtensions((prevExtensions) => prevExtensions.filter(e => e !== extension));

      return
    }

    else if (extension && renamed_extension) {
      setExtensions((prevExtensions) => {
        return prevExtensions.map((e) => e === extension ? renamed_extension : e)

      })
    }


  }

  const handleCreateNewExtension = () => {
    setDialogCreateExtensionOpen(true);
  }

  const handleDialogCreateExtension = (_,  value)  => {
    setDialogCreateExtensionOpen(!dialogCreatExtensionOpen);

    if (value) {
      

      setExtensions((prevExtensions) => {
        return [...prevExtensions,  value["extension"]];
      });
  
  
      switch_extension(value["extension"]);
      setextensionValue(extensions.length);


      setTimeout(() => {
        reactFlowInstance.fitView();
      }, 1);
    }


   

  }
    


  return (





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
        onChange={handleAutoSave}
        onLoad={() => {
          
            reactFlowInstance.fitView({padding: 0.2});
          
  
        }}
        
        




      >
        <Panel position='top-center'>


          <Box sx={{ maxWidth: { xs: 320, sm: 600 }}}>

            <Stack direction='row-reverse'>
              <IconButton sx={{color: 'pink'}} onClick={handleCreateNewExtension}><Add /></IconButton>



              <Tabs
              
                variant="scrollable"
                value={extensionValue}
                onChange={(e, value) => setextensionValue(value)}
                classes={{
      
                  flexContainer: "flexContainer",
                  indicator: "indicator"
                }}
    
                scrollButtons

                TabIndicatorProps={{style: {background: "transparent", justifyContent: 'center'}, children: <span />}}

                
                sx={{
                  
                
                  "& .MuiTab-root.Mui-selected": {
                    color: 'blue'
                  },

                  "& .indicator": {
                    display: "flex",
                    justifyContent: "center",
                    backgroundColor: "transparent",
                    "& > span": {
                      maxWidth: 40,
                      width: "100%",
                      backgroundColor: "cyan"
                    }
                  }

  
                }}

        
              >
          
                {extensions.length !== 0 ? extensions.map((value, index) => (
                  <Tab label={value} onClick={(event) => handleExtensionClick(event, value)} onContextMenu={() => handleExtensionRename(value)}  sx={{color: 'rgba(255, 255, 255, 0.7)', textTransform: 'none', fontSize: 16}} />

                )) : <Tab label="You don't have any extensions created" sx={{color: 'rgb(234, 125, 125)', textTransform: 'none', fontSize: 15}}/>}


            </Tabs>

          </Stack>

          </Box>

     
        </Panel>

        <Panel position='top-left' >

          <Sidebar />

        </Panel>

        <Panel position='top-right' >
          <div className='flex flex-col m-2 '>
            <div className='mb-5'>

              <Button fullWidth variant='contained' size="small" color='success' onClick={reloadBot} startIcon={<Refresh /> } >Reload bot</Button>


            </div>

            <div className='mb-5'>

              <Button size="small" variant='contained' color='secondary' onClick={openConsole} startIcon={< Terminal />} >Open console</Button>

            </div>


            <Button size="small" variant='contained' color='info' onClick={openDocumentation} startIcon={< HelpOutline />} >Help?</Button>

          </div>

        </Panel>

        <Background variant='dots' />
        {/* <MiniMap /> */}
        <Controls />

      </ReactFlow>

      <CreateExtension path={path} dialogOpen={dialogCreatExtensionOpen} handleDialogClose={handleDialogCreateExtension} />

      <RenameExtension extension={rightClickedExtension} path={path}  dialogOpen={dialogRenameExtensionOpen} handleDialogClose={handleDialogRenameExtension} />

      </div>






  );
};

const ProjectHome = () => {
  return ( 
    <ReactFlowProvider >

      <ProjectHomeComponent />
      

    </ReactFlowProvider>


   );
}
 
export default ProjectHome;
