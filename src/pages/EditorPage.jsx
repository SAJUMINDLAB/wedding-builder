import React from 'react';
import MobileMockup from '../components/preview/MobileMockup';
import EditorPanel from '../components/editor/EditorPanel';

const EditorPage = () => {
  return (
    <div className="main-layout">
      <MobileMockup />
      <EditorPanel />
    </div>
  );
};

export default EditorPage;
