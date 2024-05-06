import React, { useEffect, useState } from 'react'
import SayNode from '../nodes/say'
import DiscodeAPI from '../../../api/discode'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { TextField } from '@mui/material';
import Command from '../nodes/command';



export default function TreeView() {

    const api = new DiscodeAPI()

    const [data, setData] = useState({})
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        api.fetchComponents().then((value) => setData(new Map(Object.entries(value))))
        
    }, []);


    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
      };

    const filteredData = () => {
        if (!searchValue.trim()) {
          return data;
        }
        return Array.from(data).reduce((acc, [key, value]) => {
          const filteredValue = value.filter(item => item.toLowerCase().includes(searchValue.toLowerCase()));
          if (filteredValue.length > 0) {
            acc.push([key, filteredValue]);
          }
          return acc;
        }, []);
      };


    if (!data) {return <>loading...</>}


  return (

    <div>

        <TextField  label="Search 🔎" onChange={(e) => setSearchValue(e.target.value)} value={searchValue} InputLabelProps={{style: { color: 'white', opacity: '70%' }, }} inputProps={{style: { color: 'white', backgroundColor: 'rgba(127, 235, 222, 0.1)', borderRadius: '10px'}}} variant="filled" className='rounded-lg no-drag' error={false} helperText="" size="small"/>
       

        <nav class="tree-nav" className='bg-lime-500/5 pt-2' style={{maxHeight: 'calc(100vh - 150px)', overflowY: 'auto'}}>

            {searchValue === '' ? Array.from(data).map(([key, value]) => (
                <details class="tree-nav__item is-expandable" open>
                    
                    
                <summary class="tree-nav__item-title" >{key}</summary>
                        
                        {value.map((item, index) => (

                            <summary class="tree-nav__item" draggable onDragStart={(event) => {
                                onDragStart(event, item.toLowerCase())
                            }}>{
                                // item === "Say" ? <SayNode /> : 
                                // item === "Command" ? <Command /> : item

                                item
                                
                                }</summary>

                        ))}

                </details>
            )) : 
            
            filteredData().map(([key, value]) => (
                
                    value.map((item, index) => (
                        <summary
                          key={index}
                          className="tree-nav__item"
                          draggable
                          onDragStart={(event) => {
                            onDragStart(event, item.toLowerCase())
                            
                          }
                          
                        }
                        >{item}</summary>
                    ))

                
            
            ))}
        
        </nav>
    </div>



  )
}
