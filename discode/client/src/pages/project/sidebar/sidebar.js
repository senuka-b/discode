import React from 'react'
import TreeView from './treeview'
import { Typography } from '@mui/material'

export default function Sidebar() {
  return (
    <div>
      
      <Typography variant='h4' className='p-4 m-4'>Components</Typography>
      <TreeView />

    </div>
  )
}
