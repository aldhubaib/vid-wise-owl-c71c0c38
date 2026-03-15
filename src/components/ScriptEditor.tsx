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
import { SlashCommandMenu, FloatingToolbar, FloatingBlockActions, BlockOptions } from "@yoopta/ui";
import { PLAYGROUND_INIT_VALUE } from "@/data/editorInitialValue";

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
      editor.setEditorValue(PLAYGROUND_INIT_VALUE);
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
        <FloatingToolbar />
        <FloatingBlockActions>
          <BlockOptions />
        </FloatingBlockActions>
        <ActionMenuList />
      </YooptaEditor>
    </div>
  );
}
