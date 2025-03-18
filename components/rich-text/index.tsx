import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";

import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import {
  INSERT_TABLE_COMMAND,
  TableCellNode,
  TableNode,
  TableRowNode,
} from "@lexical/table";
import { LexicalEditor } from "lexical";
import React, {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useState,
} from "react";

import ToolbarPlugin from "./toolbar-plugin";

interface RichTextProps {
  value?: string;
  setValue: Dispatch<SetStateAction<any>>;
  name: string;
}

const editorConfig = {
  namespace: "React.js Demo",
  nodes: [TableNode, TableCellNode, TableRowNode],
  // Handling of errors during update
  onError(error: Error) {
    throw error;
  },
  // The editor theme
  theme: {
    code: "editor-code",
    heading: {
      h1: "editor-heading-h1",
      h2: "editor-heading-h2",
      h3: "editor-heading-h3",
      h4: "editor-heading-h4",
      h5: "editor-heading-h5",
    },
    image: "editor-image",
    link: "editor-link",
    list: {
      listitem: "editor-listitem",
      nested: {
        listitem: "editor-nested-listitem",
      },
      ol: "editor-list-ol",
      ul: "editor-list-ul",
    },
    ltr: "ltr",
    paragraph: "editor-paragraph",
    placeholder: "editor-placeholder",
    quote: "editor-quote",
    rtl: "rtl",
    table: "ExampleEditorTheme__table",
    tableCell: "ExampleEditorTheme__tableCell",
    tableCellActionButton: "ExampleEditorTheme__tableCellActionButton",
    tableCellActionButtonContainer:
      "ExampleEditorTheme__tableCellActionButtonContainer",
    tableCellHeader: "ExampleEditorTheme__tableCellHeader",
    tableCellResizer: "ExampleEditorTheme__tableCellResizer",
    tableCellSelected: "ExampleEditorTheme__tableCellSelected",
    tableSelected: "ExampleEditorTheme__tableSelected",
    tableSelection: "ExampleEditorTheme__tableSelection",
    text: {
      bold: "editor-text-bold font-bold",
      code: "editor-text-code",
      hashtag: "editor-text-hashtag",
      italic: "editor-text-italic italic",
      overflowed: "editor-text-overflowed",
      strikethrough: "editor-text-strikethrough line-through",
      underline: "editor-text-underline underline",
      underlineStrikethrough: "underline line-through",
    },
  },
};

const $updateEditorState = (editor: LexicalEditor) => {
  editor.dispatchCommand(INSERT_TABLE_COMMAND, {
    columns: String(3),
    includeHeaders: true,
    rows: String(3),
  });
};

function InsertTable({
  showTable,
  setShowTable,
}: {
  showTable: boolean;
  setShowTable: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    if (!showTable) {
      setShowTable(true);
    }
  }, [showTable, setShowTable]);

  useEffect(() => {
    if (showTable) {
      $updateEditorState(editor);
    }
  }, [editor, showTable]);
  return <></>;
}

export const Wrapper: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <LexicalComposer initialConfig={editorConfig}>{children}</LexicalComposer>
  );
};

const RichText: React.FC<RichTextProps> = ({ setValue, value, name }) => {
  // const [editor, state] = useLexicalComposerContext();

  const handleEditorChange = (editorState: any) => {
    editorState.read(() => {
      const json = editorState.toJSON();
      setValue(() => {
        return json;
      });
    });
  };

  return (
    <div className="editor-container">
      <ToolbarPlugin />
      <div className="editor-inner px-4 my-4  border-l-4  border-gray-800">
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              name={name}
              className="editor-input focus:outline-none focus:ring-0 focus-visible:outline-none"
            />
          }
          // placeholder={<Placeholder />}/
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <OnChangePlugin onChange={handleEditorChange} />
        {/* <TreeViewPlugin /> */}
        <TablePlugin />
      </div>
    </div>
  );
};

export default RichText;
