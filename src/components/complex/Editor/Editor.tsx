import React, { useEffect, useState } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor as WisywygEditor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorWrapper } from './styles';

type Props = {
  onChange(value: any): void
};

const Editor = ({ onChange }: Props) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const editorStateChangeHandler = (value: EditorState) => {
    setEditorState(value);
  };

  useEffect(() => {
    onChange(draftToHtml(convertToRaw(editorState.getCurrentContent())));
  }, [editorState, onChange]);

  return (
    <EditorWrapper>
      <WisywygEditor
        editorState={editorState}
        toolbarClassName="toolbar"
        wrapperClassName="wrapper"
        editorClassName="editor"
        onEditorStateChange={editorStateChangeHandler}
        toolbar={{
          options: [
            'inline', 'blockType', 'fontSize', 'list', 'textAlign', 'colorPicker',
          ],
        }}
      />
    </EditorWrapper>
  );
};

export default Editor;
