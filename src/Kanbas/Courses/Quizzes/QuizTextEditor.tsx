import { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Editor as TinyMCEEditor } from "tinymce";

const EDITOR_API_KEY = process.env.REACT_APP_EDITOR_API_KEY;

export default function QuizTextField({
  value,
  setValue,
}: {
  value: string;
  setValue: (v: string) => void;
}) {
  const editorRef = useRef<TinyMCEEditor | null>(null);

  return (
    <div>
      <Editor
        apiKey={EDITOR_API_KEY}
        onInit={(evt, editor) => (editorRef.current = editor)}
        value={value}
        onEditorChange={(e) => setValue(e)}
        init={{
          height: 200,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "code",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />
    </div>
  );
}