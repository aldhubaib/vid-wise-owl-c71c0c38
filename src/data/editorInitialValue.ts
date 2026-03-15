import type { YooptaContentValue } from "@yoopta/editor";

export const PLAYGROUND_INIT_VALUE: YooptaContentValue = {
  "heading-welcome": {
    id: "heading-welcome",
    type: "HeadingOne",
    value: [
      {
        id: "hw-el",
        type: "heading-one",
        children: [{ text: "Welcome to Yoopta Editor" }],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 0, depth: 0 },
  },
  "toc-block": {
    id: "toc-block",
    type: "TableOfContents",
    value: [
      {
        id: "toc-el",
        type: "table-of-contents",
        children: [{ text: "" }],
        props: { nodeType: "void" },
      },
    ],
    meta: { order: 1, depth: 0 },
  },
  "sample-image": {
    id: "sample-image",
    type: "Image",
    value: [
      {
        id: "img-el",
        type: "image",
        children: [{ text: "" }],
        props: {
          nodeType: "void",
          src: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&q=80",
          alt: "Technology workspace",
          fit: "cover",
          sizes: { width: 800, height: 450 },
        },
      },
    ],
    meta: { order: 2, depth: 0 },
  },
  "intro-paragraph": {
    id: "intro-paragraph",
    type: "Paragraph",
    value: [
      {
        id: "ip-el",
        type: "paragraph",
        children: [
          { text: "A " },
          { text: "headless", bold: true },
          { text: ", " },
          { text: "plugin-based", italic: true },
          { text: " rich-text editor for React. Built with love — " },
          { text: "20+ block types", bold: true },
          { text: ", optional themes, full control over your UI and full control of your content via powerful API." },
        ],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 3, depth: 0 },
  },
  "links-paragraph": {
    id: "links-paragraph",
    type: "Paragraph",
    value: [
      {
        id: "lp-el",
        type: "paragraph",
        children: [
          { text: "Links: " },
          { text: "Documentation", bold: true },
          { text: " · " },
          { text: "GitHub", bold: true },
          { text: " — get started and star the repo!" },
        ],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 4, depth: 0 },
  },
  "heading-marks": {
    id: "heading-marks",
    type: "HeadingTwo",
    value: [
      {
        id: "hm-el",
        type: "heading-two",
        children: [{ text: "Text marks (Bold, Italic, Underline, Strike, CodeMark, Highlight)" }],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 5, depth: 0 },
  },
  "marks-demo": {
    id: "marks-demo",
    type: "Paragraph",
    value: [
      {
        id: "md-el",
        type: "paragraph",
        children: [
          { text: "Select text to format: " },
          { text: "Bold", bold: true },
          { text: " · " },
          { text: "Italic", italic: true },
          { text: " · " },
          { text: "Underline", underline: true },
          { text: " · " },
          { text: "Strikethrough", strike: true },
          { text: " · " },
          { text: "Code", code: true },
          { text: " · " },
          { text: "Highlight", highlight: { color: "#10B981" } },
          { text: "." },
        ],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 6, depth: 0 },
  },
  "heading-plugins": {
    id: "heading-plugins",
    type: "HeadingTwo",
    value: [
      {
        id: "hp-el",
        type: "heading-two",
        children: [{ text: "Available plugins" }],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 7, depth: 0 },
  },
  "plugins-table": {
    id: "plugins-table",
    type: "Table",
    value: [
      {
        id: "pt-el",
        type: "table",
        children: [
          {
            id: "ptr-1",
            type: "table-row",
            children: [
              { id: "ptd-1", type: "table-data-cell", children: [{ text: "Plugin", bold: true }] },
              { id: "ptd-2", type: "table-data-cell", children: [{ text: "Type", bold: true }] },
              { id: "ptd-3", type: "table-data-cell", children: [{ text: "Shortcut", bold: true }] },
            ],
          },
          {
            id: "ptr-2",
            type: "table-row",
            children: [
              { id: "ptd-4", type: "table-data-cell", children: [{ text: "Paragraph" }] },
              { id: "ptd-5", type: "table-data-cell", children: [{ text: "Block" }] },
              { id: "ptd-6", type: "table-data-cell", children: [{ text: "/" }] },
            ],
          },
          {
            id: "ptr-3",
            type: "table-row",
            children: [
              { id: "ptd-7", type: "table-data-cell", children: [{ text: "Heading 1/2/3" }] },
              { id: "ptd-8", type: "table-data-cell", children: [{ text: "Block" }] },
              { id: "ptd-9", type: "table-data-cell", children: [{ text: "#, ##, ###" }] },
            ],
          },
          {
            id: "ptr-4",
            type: "table-row",
            children: [
              { id: "ptd-10", type: "table-data-cell", children: [{ text: "Blockquote" }] },
              { id: "ptd-11", type: "table-data-cell", children: [{ text: "Block" }] },
              { id: "ptd-12", type: "table-data-cell", children: [{ text: ">" }] },
            ],
          },
          {
            id: "ptr-5",
            type: "table-row",
            children: [
              { id: "ptd-13", type: "table-data-cell", children: [{ text: "Code" }] },
              { id: "ptd-14", type: "table-data-cell", children: [{ text: "Void" }] },
              { id: "ptd-15", type: "table-data-cell", children: [{ text: "```" }] },
            ],
          },
          {
            id: "ptr-6",
            type: "table-row",
            children: [
              { id: "ptd-16", type: "table-data-cell", children: [{ text: "Lists" }] },
              { id: "ptd-17", type: "table-data-cell", children: [{ text: "Block" }] },
              { id: "ptd-18", type: "table-data-cell", children: [{ text: "-, 1., []" }] },
            ],
          },
        ],
        props: { nodeType: "block", headerRow: true, headerColumn: false },
      },
    ],
    meta: { order: 8, depth: 0 },
  },
  "heading-blocks-api": {
    id: "heading-blocks-api",
    type: "HeadingTwo",
    value: [
      {
        id: "hba-el",
        type: "heading-two",
        children: [{ text: "Blocks API" }],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 9, depth: 0 },
  },
  "callout-tip": {
    id: "callout-tip",
    type: "Callout",
    value: [
      {
        id: "ct-el",
        type: "callout",
        children: [{ text: "💡 Type / to open the slash command menu and insert any block type." }],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 10, depth: 0 },
  },
  "heading-elements": {
    id: "heading-elements",
    type: "HeadingTwo",
    value: [
      {
        id: "he-el",
        type: "heading-two",
        children: [{ text: "Elements API" }],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 11, depth: 0 },
  },
  "elements-list": {
    id: "elements-list",
    type: "BulletedList",
    value: [
      {
        id: "elb-1",
        type: "bulleted-list",
        children: [{ text: "Each block has its own elements structure" }],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 12, depth: 0 },
  },
  "elements-list-2": {
    id: "elements-list-2",
    type: "BulletedList",
    value: [
      {
        id: "elb-2",
        type: "bulleted-list",
        children: [{ text: "Elements can be customized via plugin options" }],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 13, depth: 0 },
  },
  "elements-list-3": {
    id: "elements-list-3",
    type: "BulletedList",
    value: [
      {
        id: "elb-3",
        type: "bulleted-list",
        children: [{ text: "Supports inline, block, and void elements" }],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 14, depth: 0 },
  },
  "heading-marks-api": {
    id: "heading-marks-api",
    type: "HeadingTwo",
    value: [
      {
        id: "hma-el",
        type: "heading-two",
        children: [{ text: "Marks API" }],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 15, depth: 0 },
  },
  "marks-numbered-1": {
    id: "marks-numbered-1",
    type: "NumberedList",
    value: [
      {
        id: "mn-1",
        type: "numbered-list",
        children: [
          { text: "Bold" },
          { text: " — Cmd+B / Ctrl+B", code: true },
        ],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 16, depth: 0 },
  },
  "marks-numbered-2": {
    id: "marks-numbered-2",
    type: "NumberedList",
    value: [
      {
        id: "mn-2",
        type: "numbered-list",
        children: [
          { text: "Italic" },
          { text: " — Cmd+I / Ctrl+I", code: true },
        ],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 17, depth: 0 },
  },
  "marks-numbered-3": {
    id: "marks-numbered-3",
    type: "NumberedList",
    value: [
      {
        id: "mn-3",
        type: "numbered-list",
        children: [
          { text: "Underline" },
          { text: " — Cmd+U / Ctrl+U", code: true },
        ],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 18, depth: 0 },
  },
  "heading-coming": {
    id: "heading-coming",
    type: "HeadingTwo",
    value: [
      {
        id: "hc-el",
        type: "heading-two",
        children: [{ text: "Coming soon" }],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 17, depth: 0 },
  },
  "todo-1": {
    id: "todo-1",
    type: "TodoList",
    value: [
      {
        id: "td-1",
        type: "todo-list",
        children: [{ text: "Drag & drop blocks" }],
        props: { nodeType: "block", checked: true },
      },
    ],
    meta: { order: 18, depth: 0 },
  },
  "todo-2": {
    id: "todo-2",
    type: "TodoList",
    value: [
      {
        id: "td-2",
        type: "todo-list",
        children: [{ text: "Real-time collaboration" }],
        props: { nodeType: "block", checked: true },
      },
    ],
    meta: { order: 19, depth: 0 },
  },
  "todo-3": {
    id: "todo-3",
    type: "TodoList",
    value: [
      {
        id: "td-3",
        type: "todo-list",
        children: [{ text: "AI-powered writing assistant" }],
        props: { nodeType: "block", checked: false },
      },
    ],
    meta: { order: 20, depth: 0 },
  },
  "todo-4": {
    id: "todo-4",
    type: "TodoList",
    value: [
      {
        id: "td-4",
        type: "todo-list",
        children: [{ text: "Comments & annotations" }],
        props: { nodeType: "block", checked: false },
      },
    ],
    meta: { order: 21, depth: 0 },
  },
  "divider-end": {
    id: "divider-end",
    type: "Divider",
    value: [
      {
        id: "div-el",
        type: "divider",
        children: [{ text: "" }],
        props: { nodeType: "void" },
      },
    ],
    meta: { order: 22, depth: 0 },
  },
  "blockquote-end": {
    id: "blockquote-end",
    type: "Blockquote",
    value: [
      {
        id: "bq-el",
        type: "blockquote",
        children: [{ text: "The best way to predict the future is to invent it. — Alan Kay" }],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 23, depth: 0 },
  },
  "steps-block": {
    id: "steps-block",
    type: "Steps",
    value: [
      {
        id: "steps-el",
        type: "step-list",
        children: [
          {
            id: "step-i-1",
            type: "step-list-item",
            props: { order: 1 },
            children: [
              {
                id: "step-h-1",
                type: "step-list-item-heading",
                children: [{ text: "Install the editor" }],
              },
              {
                id: "step-c-1",
                type: "step-list-item-content",
                children: [{ text: "yarn add @yoopta/editor" }],
              },
            ],
          },
          {
            id: "step-i-2",
            type: "step-list-item",
            props: { order: 2 },
            children: [
              {
                id: "step-h-2",
                type: "step-list-item-heading",
                children: [{ text: "Add plugins" }],
              },
              {
                id: "step-c-2",
                type: "step-list-item-content",
                children: [{ text: "Import and configure the plugins you need" }],
              },
            ],
          },
          {
            id: "step-i-3",
            type: "step-list-item",
            props: { order: 3 },
            children: [
              {
                id: "step-h-3",
                type: "step-list-item-heading",
                children: [{ text: "Render the editor" }],
              },
              {
                id: "step-c-3",
                type: "step-list-item-content",
                children: [{ text: "Use the <YooptaEditor /> component in your React app" }],
              },
            ],
          },
        ],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 24, depth: 0 },
  },
  "end-paragraph": {
    id: "end-paragraph",
    type: "Paragraph",
    value: [
      {
        id: "ep-el",
        type: "paragraph",
        children: [{ text: "" }],
        props: { nodeType: "block" },
      },
    ],
    meta: { order: 25, depth: 0 },
  },
} as any;
