
import React from 'react';

import { Button, Dialog, DialogActions, DialogContent,  DialogTitle,  TextField } from '@mui/material';

import DiscodeAPI from '../../../api/discode'


const ConfirmationDialog = ({ open, onClose, onConfirm, title, content }) => {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{content}</DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="error">
            Cancel
          </Button>
          <Button onClick={onConfirm} color="success" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  


export default function RenameExtension({path, extension, dialogOpen, handleDialogClose}) {

    const api = new DiscodeAPI();
    const [openConfirm, setopenConfirm] = React.useState(false)


    const deleteExtension = () => {
        setopenConfirm(true);
    }

    const handleDialogConfirm = () => {
        api.deleteExtension({path, name: extension}); 
        handleDialogClose(extension, null, true);
        setopenConfirm(false);
        

    }

  return (
    <div >
        <ConfirmationDialog open={openConfirm} onClose={() => setopenConfirm(false)} onConfirm={handleDialogConfirm} title="You sure you wanna do this?" content="Proceeding would delete this extension and all data would be lost! This action cannot be undone."/>

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


   
                api.renameExtension({
                    path,
                    name: extension,
                    rename: name
                })

                handleDialogClose(extension, name);
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
                defaultValue={extension}
            />
    
 

            </DialogContent>
            <DialogActions sx={{bgcolor: '#282424'}}>
                <Button variant="contained" onClick={handleDialogClose}>Cancel</Button>
                <Button variant="contained"  onClick={deleteExtension} color='error' type="submit">Delete extension</Button>

                <Button variant="contained" color='secondary' type="submit">Rename extension</Button>
            </DialogActions>
        </Dialog>

    </div>
  )
}


