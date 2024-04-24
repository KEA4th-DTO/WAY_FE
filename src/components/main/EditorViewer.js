import React from 'react';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { Viewer } from '@toast-ui/react-editor';

const EditorViewer = ({ contents }) => {
  return (
    <>
      <Viewer initialValue={ contents || ''} />
    </>
  );
}
export default EditorViewer;