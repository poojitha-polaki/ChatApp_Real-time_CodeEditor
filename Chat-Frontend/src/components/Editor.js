import React from 'react'
import { Editor } from '@monaco-editor/react'

const EditorComponent = ({language , roomId , socketRef , code , onChange}) => {
  return (
    <div className='h-full w-full'>
      <Editor
        height="95%"
        defaultLanguage="javascript"
        defaultValue="// Start typing here..."
        language={language}
        value={code}
        onChange={onChange}
        theme='vs-dark'
        options={
          {
            minimap: {
              enabled: false
            },
            fontSize: 16
          }
        }
      />
    </div>
  )
}

export default EditorComponent