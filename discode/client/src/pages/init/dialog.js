
import React from 'react';

import { Button, Dialog, DialogActions, DialogContent,  DialogTitle,  TextField } from '@mui/material';
import DiscodeAPI from '../../api/discode';

import { useNavigate } from 'react-router-dom';



export default function CreateProjectDialog({open, handleClose}) {

    const api = new DiscodeAPI();

    const navigate = useNavigate()

    const [location, setLocation] = React.useState('No location selected');
    

  return (
    <div >
        <Dialog
    

            open={open}
            onClose={handleClose}

            PaperProps={{
            component: 'form',
            onSubmit: (event) =>  {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                const formJson = Object.fromEntries(formData.entries());
                const name = formJson.name;
                
                const data = {
                    "project_name": name,
                    "bot_token": formJson.token,
                    "default_command_prefix": formJson.prefix,
                    "path": location,
                    "description": formJson.description,
                  
                }



                
                api.createNewProject(data).then((value) => {
                    console.log(value);
                    if (value === "file_exists") {
                        window.electron_.dialog.message(`A project with the name ${name} already exists in ${location}. Create ${name} in another location or, use another name!`);

                    } else {

                        navigate("/project", {state: {path: location+"/"+name}})
                    }
                });
                
                

                handleClose();
            },
            }}
        >
            <DialogTitle sx={{bgcolor: '#282424', color: "aliceblue"}}>Create project 🎉</DialogTitle>
            <DialogContent sx={{bgcolor:'lightgrey', color: 'blue', }}>

                
            
            <TextField
                autoFocus
                required
                margin="dense"
                id="name"
                name="name"
                label="Name of the project"
                type="text"
                fullWidth
                variant="filled"
            />
            <TextField
                autoFocus
                required
                margin="dense"
                id="name"
                name="token"
                label="Token of the bot"
                type="password"
                fullWidth
                variant="filled"
            />
            <TextField
                autoFocus
                required
                margin="dense"
                id="name"
                name="prefix"
                label="Default command prefix"
                type="text"
                fullWidth
                variant="filled"
            />

            <TextField
                autoFocus
                required
                margin="dense"
                id="name"
                name="path"
                label="Path to your project"
                type="text"
                fullWidth
                variant="filled"
                value={location}
                onClick={() => {

         

                    window.electron_.ipcRenderer.send("open-folder-dialog");

                    window.electron_.ipcRenderer.once("selected-folder", (location) => {

                        setLocation(location);


                    });

                   
                }}
            />
 

            <TextField
                autoFocus
                margin="dense"
                id="name"
                name="description"
                label="A simple description of the project"
                type="text"
                fullWidth
                variant="filled"
            />


            </DialogContent>
            <DialogActions sx={{bgcolor: '#282424'}}>
                <Button variant="contained" onClick={handleClose}>Cancel</Button>
                <Button variant="contained" color='secondary' type="submit">Create project</Button>
            </DialogActions>
        </Dialog>

    </div>
  )
}


