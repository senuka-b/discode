import React, { useState, useEffect } from 'react'
import {useLocation} from 'react-router-dom'
import { io } from 'socket.io-client'

export default function Console() {
  const [logs, setlogs] = useState([])

  const location = useLocation();

  useEffect(() => {
      const queryParams = new URLSearchParams(location.search);
      const rawData = queryParams.get('data');
      if (rawData) {
          const decodedData = decodeURIComponent(rawData);
          setlogs(JSON.parse(decodedData));
      }

      console.log(logs);
  }, []);

 

  var socket = io('http://localhost:5000')

  socket.on("error", ( {message} )=> {
    message = 'ERROR: ' + message

    setlogs([...logs, message])

    window.electron_.saveConsoleState(logs);

  })

  return (
    <div style={{
        paddingLeft: 20,
     
        paddingtop: 30,
        margin: 10
        
        
    }}>
        {logs.length === 0 ? "No logs yet!" :  (
    <div>
        {logs.map((log, index) => (
            <div>
                    <div style={{paddingBottom: 10, fontFamily: 'Consolas, Lucida Console', color:log.startsWith("ERROR") ? 'red' : 'cyan'}}>
                        {log}

                    </div>
     
            </div>
        ))}
    </div>
)}

    </div>
  )
}
