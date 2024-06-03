import React from 'react';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { Viewer } from '@toast-ui/react-editor';

type Props = {
  contents: string;
};

function EditorViewer ({ contents }: Props) {
  return (
    <section >
    <Viewer initialValue={contents} />
  </section>
  );
}
export default EditorViewer;