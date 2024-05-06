
import React from 'react';

import { Button, Dialog, DialogActions, DialogContent,  DialogTitle,  TextField } from '@mui/material';

import DiscodeAPI from '../../../api/discode'





export default function CreateExtension({path, dialogOpen, handleDialogClose}) {

    const api = new DiscodeAPI();


    

  return (
    <div >
        <Dialog
    

            open={dialogOpen}
            onClose={() => handleDialogClose()}

            PaperProps={{
            component: 'form',
            onSubmit: (event) =>  {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                const formJson = Object.fromEntries(formData.entries());
                const name = formJson.name;
                const description = formJson.description;

                var data = {
                    "name": name,
                    "description": description,
                    "path": path,
                }

                
                api.createExtension(data).then((value) => {
                    handleDialogClose(null, value)               
                })

             
            },
            }}
        >
            <DialogTitle sx={{bgcolor: '#282424', color: "aliceblue"}}>Create new Extension</DialogTitle>
            <DialogContent sx={{bgcolor:'lightgrey', color: 'blue', }}>

                
            
            <TextField
                autoFocus
                required
                margin="dense"
                id="name"
                name="name"
                label="Name of the extension"
                type="text"
                fullWidth
                variant="filled"
            />

            <TextField
                autoFocus
                
                margin="dense"
                id="description"
                name="description"
                label="Description"
                type="text"
                fullWidth
                variant="filled"
            />
    
 

            </DialogContent>
            <DialogActions sx={{bgcolor: '#282424'}}>
                <Button variant="contained" onClick={handleDialogClose}>Cancel</Button>
                <Button variant="contained" color='secondary' type="submit">Create extension</Button>
            </DialogActions>
        </Dialog>

    </div>
  )
}


