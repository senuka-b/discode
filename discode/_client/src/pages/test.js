import React, { useState } from 'react';
import ReactFlow, { Controls } from 'reactflow';
import Tree, { TreeNode } from 'rc-tree';
import 'rc-tree/assets/index.css';

const YourApp = () => {
  const [treeData, setTreeData] = useState([
    {
      key: '0',
      title: 'Node 1',
      children: [
        { key: '0-0', title: 'Node 1.1' },
        { key: '0-1', title: 'Node 1.2' },
      ],
    },
    {
      key: '1',
      title: 'Node 2',
    },
  ]);

  const [elements, setElements] = useState([]);

  const onDrop = (info) => {
    // handle drop event from rc-tree
    console.log('Dropped:', info);
    // Update your React Flow elements based on the drop
    const newElements = [...elements, /* construct elements based on drop info */];
    setElements(newElements);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Tree
        defaultExpandAll
        draggable
        onDrop={onDrop}
        treeData={treeData}
      />
      <div style={{ flex: 1 }}>
        <ReactFlow elements={elements} />
      </div>
    </div>
  );
};

export default YourApp;
