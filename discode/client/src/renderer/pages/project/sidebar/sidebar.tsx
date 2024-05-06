import React from 'react'
import TreeView from './treeview'
import { IconButton, Typography } from '@mui/material'
import { KeyboardDoubleArrowRight } from '@mui/icons-material'

export default function Sidebar() {

  const [isVisible, setisVisible] = React.useState(true);



  return (
    <div>
      <div >
      
      <div className='flex flex-row pt-4 mt-4 pb-10 mb-3  ' style={{padding: 0, }}>
        <IconButton size='small'  onClick={(event) => {
 

          setisVisible(!isVisible);
        }}>
            <KeyboardDoubleArrowRight color='warning' style={{ fontSize: '40px', transform: isVisible ? 'rotate(90deg)' : 'none',  }}/>
        </IconButton>

        <div className={`sidebar-content ${isVisible ? 'visible' : 'hidden'}`} >

        <Typography variant='h4' className='pt-1 pb-1 mt-2' >Components</Typography>

        </div>

      </div>

      <div className={`sidebar-content ${isVisible ? 'visible' : 'hidden'}`}  >
        <TreeView />

      </div>

     

    </div>
    </div>
  )
}
