import React, { useState, useEffect } from 'react'


export default function Console() {
  const [logs, setlogs] = useState<any>([])

useEffect(() => {
  window.electron.ipcRenderer.on("send-log", (logs) => {
    console.log(logs);
    setlogs(logs);
  })


}, [])




  const handleClickLog = (node: string) => {

    window.electron.ipcRenderer.send('clicked-log', node);


  }


  return (
    <div style={{
        paddingLeft: 20,

        margin: 10,




    }}>
        {logs.length === 0 ? "No logs yet!" :  (
    <div>
        {logs.map(({message, node, type, time}:{message: string, node: string, type: string, time: string}, index: number) => (
            <div>
                    <div className='logDiv' style={{paddingBottom: 10, fontFamily: 'Consolas, Lucida Console', color:type ===
                    "error" ? 'red' : 'cyan',}} onClick={() =>{ handleClickLog(node)}} >
                        {time} - {message}

                    </div>

            </div>
        ))}
    </div>
)}

    </div>
  )
}
