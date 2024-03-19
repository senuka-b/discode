
import React from 'react';

import { Button, Dialog, DialogActions, DialogContent,  DialogTitle,  TextField } from '@mui/material';

import DiscodeAPI from '../../api/discode'





export default function renameExtenson({dialogOpen, handleDialogClose}) {

    const api = new DiscodeAPI();


    

  return (
    <div >
        <Dialog
    

            open={dialogOpen}
            onClose={handleDialogClose}

            PaperProps={{
            component: 'form',
            onSubmit: (event) =>  {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                const formJson = Object.fromEntries(formData.entries());
                const name = formJson.name;
                

                

                handleDialogClose();
            },
            }}
        >
            <DialogTitle sx={{bgcolor: '#282424', color: "aliceblue"}}>Rename Extension</DialogTitle>
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
    
 

            </DialogContent>
            <DialogActions sx={{bgcolor: '#282424'}}>
                <Button variant="contained" onClick={handleDialogClose}>Cancel</Button>
                <Button variant="contained" color='secondary' type="submit">Rename dialog</Button>
            </DialogActions>
        </Dialog>

    </div>
  )
}


