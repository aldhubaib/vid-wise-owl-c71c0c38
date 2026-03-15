import { useCallback, useEffect, useMemo, useRef } from "react";
import YooptaEditor, {
  createYooptaEditor,
  type YooptaContentValue,
  type YooptaPlugin,
} from "@yoopta/editor";
import Paragraph from "@yoopta/paragraph";
import { HeadingOne, HeadingTwo, HeadingThree } from "@yoopta/headings";
import Blockquote from "@yoopta/blockquote";
import Callout from "@yoopta/callout";
import { NumberedList, BulletedList, TodoList } from "@yoopta/lists";
import Code from "@yoopta/code";
import Table from "@yoopta/table";
import Accordion from "@yoopta/accordion";
import Divider from "@yoopta/divider";
import Link from "@yoopta/link";
import Embed from "@yoopta/embed";
import Image from "@yoopta/image";
import Video from "@yoopta/video";
import File from "@yoopta/file";
import Steps from "@yoopta/steps";
import TableOfContents from "@yoopta/table-of-contents";
import { Bold, Italic, Underline, Strike, CodeMark, Highlight } from "@yoopta/marks";
import { applyTheme } from "@yoopta/themes-shadcn";
import { SlashCommandMenu } from "@yoopta/ui";

const YImage = Image.extend({
  options: {
    upload: async (file: globalThis.File) => ({
      id: file.name,
      src: URL.createObjectURL(file),
      alt: "uploaded",
      fit: "cover" as const,
      sizes: { width: file.size, height: file.size },
    }),
  },
});

const PLUGINS: any[] = [
  TableOfContents,
  File.extend({
    options: {
      upload: async (file: globalThis.File) => ({
        id: file.name,
        src: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        format: file.name.split(".").pop(),
      }),
    },
  }),
  Code.Code,
  Code.CodeGroup,
  Table,
  Accordion,
  Divider,
  Paragraph,
  HeadingOne.extend({
    elements: { "heading-one": { placeholder: "Heading 1" } },
  }),
  HeadingTwo,
  HeadingThree,
  Blockquote,
  Callout,
  Link,
  NumberedList,
  BulletedList,
  TodoList,
  Embed,
  YImage,
  Video.extend({
    options: {
      upload: async (file: globalThis.File) => ({
        id: file.name,
        src: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        format: file.name.split(".").pop(),
      }),
    },
  }),
  Steps.extend({
    elements: {
      "step-list-item-heading": { placeholder: "Step title" },
      "step-list-item-content": { placeholder: "Describe this step..." },
    },
  }),
];

const MARKS = [Bold, Italic, Underline, Strike, CodeMark, Highlight];

// Same data as the yoopta collaboration example
const INITIAL_VALUE: any = {
  "block-1": {
    id: "block-1",
    type: "NumberedList",
    value: [
      {
        id: "el-1",
        type: "numbered-list",
        children: [{ text: "asd asas" }],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 0, depth: 0 },
  },
  "block-2": {
    id: "block-2",
    type: "NumberedList",
    value: [
      {
        id: "el-2",
        type: "numbered-list",
        children: [{ text: "asd" }],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 1, depth: 0 },
  },
  "block-3": {
    id: "block-3",
    type: "NumberedList",
    value: [
      {
        id: "el-3",
        type: "numbered-list",
        children: [{ text: "dasd" }],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 2, depth: 0 },
  },
  "block-4": {
    id: "block-4",
    type: "NumberedList",
    value: [
      {
        id: "el-4",
        type: "numbered-list",
        children: [{ text: "sdsadsa" }],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 3, depth: 0 },
  },
  "block-5": {
    id: "block-5",
    type: "NumberedList",
    value: [
      {
        id: "el-5",
        type: "numbered-list",
        children: [{ text: "daвыфвфвфыв фы вфывфы вфыjkjk выфвфы" }],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 4, depth: 0 },
  },
  "block-6": {
    id: "block-6",
    type: "Table",
    value: [
      {
        id: "table-el",
        type: "table",
        children: [
          {
            id: "tr-1",
            type: "table-row",
            children: [
              { id: "td-1", type: "table-data-cell", children: [{ text: "" }] },
              { id: "td-2", type: "table-data-cell", children: [{ text: "" }] },
              { id: "td-3", type: "table-data-cell", children: [{ text: "" }] },
            ],
          },
          {
            id: "tr-2",
            type: "table-row",
            children: [
              { id: "td-4", type: "table-data-cell", children: [{ text: "" }] },
              { id: "td-5", type: "table-data-cell", children: [{ text: "" }] },
              { id: "td-6", type: "table-data-cell", children: [{ text: "" }] },
            ],
          },
          {
            id: "tr-3",
            type: "table-row",
            children: [
              { id: "td-7", type: "table-data-cell", children: [{ text: "" }] },
              { id: "td-8", type: "table-data-cell", children: [{ text: "" }] },
              { id: "td-9", type: "table-data-cell", children: [{ text: "" }] },
            ],
          },
        ],
        props: { nodeType: "block", headerRow: false, headerColumn: false },
      },
    ],
    meta: { order: 5, depth: 0 },
  },
  "block-7": {
    id: "block-7",
    type: "NumberedList",
    value: [
      {
        id: "el-7",
        type: "numbered-list",
        children: [{ text: "dasdasd" }],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 6, depth: 0 },
  },
  "block-8": {
    id: "block-8",
    type: "HeadingThree",
    value: [
      {
        id: "el-8",
        type: "heading-three",
        children: [{ text: "Table of Contents" }],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 7, depth: 0 },
  },
  "block-9": {
    id: "block-9",
    type: "Paragraph",
    value: [
      {
        id: "el-9",
        type: "paragraph",
        children: [{ text: "dssdfsdf" }],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 8, depth: 0 },
  },
  "block-10": {
    id: "block-10",
    type: "Paragraph",
    value: [
      {
        id: "el-10",
        type: "paragraph",
        children: [{ text: "hyth" }],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 9, depth: 0 },
  },
  "block-11": {
    id: "block-11",
    type: "BulletedList",
    value: [
      {
        id: "el-11",
        type: "bulleted-list",
        children: [{ text: "" }],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 10, depth: 0 },
  },
  "block-12": {
    id: "block-12",
    type: "BulletedList",
    value: [
      {
        id: "el-12",
        type: "bulleted-list",
        children: [{ text: "d asd" }],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 11, depth: 0 },
  },
  "block-13": {
    id: "block-13",
    type: "Steps",
    value: [
      {
        id: "step-1",
        type: "step-list",
        children: [
          {
            id: "step-item-1",
            type: "step-list-item",
            children: [
              {
                id: "step-head-1",
                type: "step-list-item-heading",
                children: [{ text: "Step 1" }],
              },
              {
                id: "step-content-1",
                type: "step-list-item-content",
                children: [{ text: "Step 1 content" }],
              },
            ],
          },
          {
            id: "step-item-2",
            type: "step-list-item",
            children: [
              {
                id: "step-head-2",
                type: "step-list-item-heading",
                children: [{ text: "Step 2" }],
              },
              {
                id: "step-content-2",
                type: "step-list-item-content",
                children: [{ text: "Step 2 content" }],
              },
            ],
          },
        ],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 12, depth: 0 },
  },
  "block-14": {
    id: "block-14",
    type: "BulletedList",
    value: [
      {
        id: "el-14",
        type: "bulleted-list",
        children: [{ text: "asdas" }],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 13, depth: 0 },
  },
  "block-15": {
    id: "block-15",
    type: "NumberedList",
    value: [
      {
        id: "el-15",
        type: "numbered-list",
        children: [{ text: "dasdas" }],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 14, depth: 0 },
  },
  "block-16": {
    id: "block-16",
    type: "NumberedList",
    value: [
      {
        id: "el-16",
        type: "numbered-list",
        children: [{ text: "urufh" }],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 15, depth: 0 },
  },
  "block-17": {
    id: "block-17",
    type: "NumberedList",
    value: [
      {
        id: "el-17",
        type: "numbered-list",
        children: [{ text: "jfjfj" }],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 16, depth: 0 },
  },
  "block-18": {
    id: "block-18",
    type: "Paragraph",
    value: [
      {
        id: "el-18",
        type: "paragraph",
        children: [{ text: "لشسلسل" }],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 17, depth: 0 },
  },
  "block-19": {
    id: "block-19",
    type: "Paragraph",
    value: [
      {
        id: "el-19",
        type: "paragraph",
        children: [{ text: "سشل" }],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 18, depth: 0 },
  },
  "block-20": {
    id: "block-20",
    type: "Paragraph",
    value: [
      {
        id: "el-20",
        type: "paragraph",
        children: [{ text: "شسل" }],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 19, depth: 0 },
  },
};

const EDITOR_STYLES = {
  width: "100%",
  paddingBottom: 60,
};

interface ScriptEditorProps {
  onChange?: (value: YooptaContentValue) => void;
}

export default function ScriptEditor({ onChange }: ScriptEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const editor = useMemo(() => {
    return createYooptaEditor({
      plugins: applyTheme(PLUGINS) as unknown as YooptaPlugin<any, any>[],
      marks: MARKS,
    });
  }, []);

  useEffect(() => {
    editor.withoutSavingHistory(() => {
      editor.setEditorValue(INITIAL_VALUE);
    });
  }, [editor]);

  const handleChange = useCallback(
    (value: YooptaContentValue) => {
      onChange?.(value);
    },
    [onChange]
  );

  return (
    <div ref={containerRef} className="yoopta-editor-container">
      <YooptaEditor
        editor={editor}
        style={EDITOR_STYLES}
        placeholder="Type / to open commands…"
        onChange={handleChange}
      >
        <SlashCommandMenu />
      </YooptaEditor>
    </div>
  );
}
