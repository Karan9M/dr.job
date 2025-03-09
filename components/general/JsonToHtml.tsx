"use client"
import TextAlign from "@tiptap/extension-text-align";
import { EditorContent, JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Typogrophy from "@tiptap/extension-typography";

export default function JsonToHtml({json}:{json:JSONContent}) {
    const editor = useEditor({
            extensions:[
                StarterKit,
                TextAlign.configure({
                    types:[
                        'heading','paragraph'
                    ]
                }),
                Typogrophy,
            ],
            immediatelyRender:false,
            editorProps:{
                attributes:{
                    class:'prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert'
                }
            },
            editable:false,
            content: json,
        });
        return <EditorContent editor={editor}/>
}
