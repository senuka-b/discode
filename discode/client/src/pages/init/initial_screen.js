import React from 'react';

import Button from "@mui/material/Button";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {  CardActionArea,CardMedia,Grid, Typography } from '@mui/material';



import banner from '../../assets/project_banner.png';
import CreateProjectDialog from './dialog';
import DiscodeAPI from '../../api/discode';



const InitialScreen = () => {

    
    const [open, setOpen] = React.useState(false);

    const api = new DiscodeAPI();
    console.log("abc", api.fetchRecentProjects())
    

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [recentProjects, setRecentProjects] = React.useState([]);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await api.fetchRecentProjects();

                setRecentProjects(data);
            } catch (error) {
                console.error('Error fetching recent projects:', error);
            }
        };

        fetchData();

    // eslint-disable-next-line
    }, []);


    return ( 

        

        <div className='project-overview' style={{
            scrollbarWidth: 'none'
        }}>

            <Typography variant="h3" className="discode-h3" >
                Discode
            </Typography>

            <Card variant='outlined' className="init-card" style={ {
                backgroundColor: 'transparent'

            }} >

                <CardContent>

                    <div style={ {
                        display : "flex",
                        flexDirection: "column"
                    } }>

                        
                        <Button variant="contained" color="secondary" style={
                            {
                                marginBottom: "30px"
                            }
                        } onClick={handleClickOpen}>Create new project</Button>

                        <CreateProjectDialog open={open} handleClose={handleClose}  />


                        <Button variant="contained" onClick={() => {
                            window.electron_.ipcRenderer.send("open-file-dialog");

                            window.electron_.ipcRenderer.once("selected-file", (location) => {

                                console.log(location);
        
                    
        
                            });

                        }} >Open exisiting project</Button>


                    </div>
                </CardContent>

            </Card>


            {/* Recent projects */}



                <Typography variant='h6'borderColor={'white'} paddingTop={5} paddingLeft={3}>Recent projects</Typography>

            <div style={{  overflow: 'auto', maxHeight: '100vh',  scrollbarWidth: 'none', '-ms-overflow-style': 'none', scrollbarColor: 'blue'}}>
                <Grid container direction='column' spacing={2} padding={2} style={{paddingTop: "30px", overflow: 'hidden', maxHeight: '100%',  scrollbarWidth: 'none',}}>
                    
                    {recentProjects.length !== 0 ? recentProjects.map((project, index) => (
                            
                        <Grid item  >
                            <Card sx={{ maxWidth: '22%', maxHeight: 200,}} >
                            <CardActionArea >

                                <CardMedia sx={{ height: 120,  }} image={banner} title="Test"  />

                                <CardContent style={{backgroundColor: 'blueviolet'}}>

                                    <Typography gutterBottom variant="h6" component="div">
                                        { project }
                                    </Typography>
                                    
                                </CardContent>
                            </CardActionArea>

                    
                        </Card>
                        </Grid>

                         //
                    )) : <Grid item  >
                    <Card sx={{ maxWidth: '22%', maxHeight: 200,}} >
                    <CardActionArea >


                        <CardContent style={{backgroundColor: '#CD7C7C'}}>

                            <Typography gutterBottom variant="h6" component="div">
                                { "You don't have any projects yet!\n\n Create one! 🐈"}
                            </Typography>
                            
                        </CardContent>
                    </CardActionArea>

            
                </Card>
                </Grid>}
                    
                            
                </Grid>
            </div>

            
        </div>
     );
}
 
export default InitialScreen;