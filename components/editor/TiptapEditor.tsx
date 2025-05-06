import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Dropcursor from "@tiptap/extension-dropcursor";
import Image from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import { toast } from "react-toastify";

interface TiptapEditorProps {
  onChange?: (content: string) => void;
}
const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      backgroundColor: {
        default: null,
        parseHTML: (el) => el.getAttribute("data-background-color"),
        renderHTML: (attrs) => ({
          "data-background-color": attrs.backgroundColor,
          style: `background-color: ${attrs.backgroundColor}`,
        }),
      },
    };
  },
});


type Level = 1 | 2 | 3 | 4 | 5 | 6;
const MenuBar = ({ editor }: { editor?: ReturnType<typeof useEditor> }) => {
  if (!editor) return null;

  const addImage = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
  
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      
      const formData = new FormData();
      formData.append("file", file);
  
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
  
        if (!res.ok) throw new Error("Lỗi tải ảnh lên Cloudinary");
        const data = await res.json();
        if (data?.url) {
          editor.chain().focus().setImage({ src: data.url }).run();
        } else {
          toast.error("Upload thất bại!");
        }
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Lỗi khi upload ảnh");
      }
    };
  
    input.click();
  };

  return (
    <div className="flex flex-wrap gap-2 p-4 border-b border-gray-300 bg-white sticky top-0 z-10 text-sm">
      {/* TABLE GROUP */}
      <div className="flex flex-wrap gap-1">
        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
          className="btn"
        >
          Insert Table
        </button>
        <button
          onClick={() => editor.chain().focus().addColumnBefore().run()}
          disabled={!editor.can().addColumnBefore()}
          className="btn"
        >
          Add Col Before
        </button>
        <button
          onClick={() => editor.chain().focus().addColumnAfter().run()}
          disabled={!editor.can().addColumnAfter()}
          className="btn"
        >
          Add Col After
        </button>
        <button
          onClick={() => editor.chain().focus().deleteColumn().run()}
          disabled={!editor.can().deleteColumn()}
          className="btn"
        >
          Delete Col
        </button>
        <button
          onClick={() => editor.chain().focus().addRowBefore().run()}
          disabled={!editor.can().addRowBefore()}
          className="btn"
        >
          Add Row Before
        </button>
        <button
          onClick={() => editor.chain().focus().addRowAfter().run()}
          disabled={!editor.can().addRowAfter()}
          className="btn"
        >
          Add Row After
        </button>
        <button
          onClick={() => editor.chain().focus().deleteRow().run()}
          disabled={!editor.can().deleteRow()}
          className="btn"
        >
          Delete Row
        </button>
        <button
          onClick={() => editor.chain().focus().deleteTable().run()}
          disabled={!editor.can().deleteTable()}
          className="btn"
        >
          Delete Table
        </button>
        <button
          onClick={() => editor.chain().focus().mergeCells().run()}
          disabled={!editor.can().mergeCells()}
          className="btn"
        >
          Merge Cells
        </button>
        <button
          onClick={() => editor.chain().focus().splitCell().run()}
          disabled={!editor.can().splitCell()}
          className="btn"
        >
          Split Cell
        </button>
        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .setCellAttribute("backgroundColor", "#FAF594")
              .run()
          }
          disabled={
            !editor.can().setCellAttribute("backgroundColor", "#FAF594")
          }
          className="btn"
        >
          Set Cell BG
        </button>
        <button
          onClick={() => editor.chain().focus().fixTables().run()}
          className="btn"
        >
          Fix Table
        </button>
      </div>

      {/* HEADINGS */}
      <div className="flex flex-wrap gap-1">
        {[1, 2, 3].map((level) => (
          <button
            key={level}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level : level as Level }).run()
            }
            className={`btn ${
              editor.isActive("heading", { level }) ? "bg-gray-300" : ""
            }`}
          >
            H{level}
          </button>
        ))}
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`btn ${editor.isActive("paragraph") ? "bg-gray-300" : ""}`}
        >
          Paragraph
        </button>
      </div>

      {/* TEXT FORMAT */}
      <div className="flex flex-wrap gap-1">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`btn ${editor.isActive("bold") ? "bg-gray-300" : ""}`}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`btn ${editor.isActive("italic") ? "bg-gray-300" : ""}`}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`btn ${editor.isActive("strike") ? "bg-gray-300" : ""}`}
        >
          Strike
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`btn ${
            editor.isActive("highlight") ? "bg-yellow-200" : ""
          }`}
        >
          Highlight
        </button>
      </div>
      <div className="flex flex-wrap gap-1">
      <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`btn ${
            editor.isActive('bulletList') ? "bg-yellow-200" : ""
          }`}
        >
          Bullet list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`btn ${
            editor.isActive('orderedList') ? "bg-yellow-200" : ""
          }`}
        >
          Ordered list
        </button>
      </div>

      {/* TEXT ALIGN */}
      <div className="flex flex-wrap gap-1">
        {["left", "center", "right", "justify"].map((align) => (
          <button
            key={align}
            onClick={() => editor.chain().focus().setTextAlign(align).run()}
            className={`btn ${
              editor.isActive({ textAlign: align }) ? "bg-gray-300" : ""
            }`}
          >
            {align.charAt(0).toUpperCase() + align.slice(1)}
          </button>
        ))}
      </div>

      {/* IMAGE */}
      <button onClick={addImage} className="btn bg-blue-100 hover:bg-blue-200">
        Add Image
      </button>
    </div>
  );
};

const TiptapEditor = ({onChange}: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Document,
      Paragraph,
      Text,
      Dropcursor,
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      CustomTableCell,
      BulletList,
      OrderedList,
      ListItem,
    ],
    content: ``,
    onUpdate({ editor }) {
      const html = editor.getHTML();
      onChange?.(html);
    },
  });

  return (
    <div className="max-w-4xl mx-auto my-8">
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="prose max-w-none p-4 border border-gray-300 rounded-md bg-white"
      />
    </div>
  );
};

export default TiptapEditor;