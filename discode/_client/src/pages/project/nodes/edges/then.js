import React, { FC } from 'react';
import { EdgeProps, getSmoothStepPath, EdgeLabelRenderer, BaseEdge, MarkerType } from 'reactflow';

const Then = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
   style
}) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={style}/>
      <EdgeLabelRenderer >
        {/* <div
          style={{
            position: 'absolute',
            transform: `translate(0%, 0%) translate(${labelX}px,${labelY}px)`,
          
            padding: 10,
            borderRadius: 5,
            fontSize: 12,
            fontWeight: 700,
          }}
          className="nodrag nopan"
        >
          {data.label}
          

          
        </div> */}

        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -60%) translate(${labelX}px,${labelY}px)`,
            background: 'transparent',
            padding: 10,
            borderRadius: 5,
            fontSize: 12,
            fontWeight: 700,
          }}
          className="nodrag nopan"
        >
        <div style={{ display: 'flex', flexDirection: 'row' }}>
      {data.variables.map((item, index) => (
          <React.Fragment key={index}>
            <div className='pr-3 '>
            {index !== 0 && "  +  "}

            </div>
            <div style={{ marginRight: '10px' }} className='font-medium bg-slate-500/35'>
                {item}
            </div>
        </React.Fragment>
      ))}
    </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default Then;