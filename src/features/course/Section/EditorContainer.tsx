import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  Heading1,
  Bold,
  Italic,
  Quote,
  Code,
  LinkIcon,
  List,
  ListOrdered,
  FileUp,
} from 'lucide-react';
import styles from './Section.module.css';
import { marked } from 'marked';

marked.setOptions({
  breaks: true,
  gfm: true,
});

interface EditorContainerProps {
  initialValue?: string;
  onContentChange?: (content: string) => void;
  minHeight?: number;
}

interface EditorContainerRef {
  setContent: (content: string) => void;
  getContent: () => string;
}

const EditorContainer = forwardRef<EditorContainerRef, EditorContainerProps>(
  function EditorContainer({ initialValue = '', onContentChange }, ref) {
    const [markdown, setMarkdown] = useState(initialValue || '');
    const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});
    const [activeTab, setActiveTab] = useState('write');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const initializedRef = useRef(false);

    useImperativeHandle(ref, () => ({
      setContent: (content: string) => {
        setMarkdown(content || '');
        setTimeout(adjustTextareaHeight, 0);
      },
      getContent: () => markdown,
    }));

    useEffect(() => {
      if (!initializedRef.current && initialValue) {
        setMarkdown(initialValue);
        initializedRef.current = true;
      }
    }, [initialValue]);

    useEffect(() => {
      if (onContentChange) {
        onContentChange(markdown);
      }
    }, [markdown, onContentChange]);

    const adjustTextareaHeight = useCallback(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }, []);

    useEffect(() => {
      adjustTextareaHeight();
    }, [markdown, activeTab, adjustTextareaHeight]);

    const insertMarkdown = useCallback(
      (before: string, after = '') => {
        if (!textareaRef.current) return;

        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);
        const newText =
          textarea.value.substring(0, start) +
          before +
          selectedText +
          after +
          textarea.value.substring(end);

        setMarkdown(newText);

        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(
            start + before.length,
            start + before.length + selectedText.length,
          );
          adjustTextareaHeight();
        }, 0);
      },
      [adjustTextareaHeight],
    );

    const handleToolbarAction = useCallback(
      (action: string) => {
        switch (action) {
          case 'heading':
            insertMarkdown('# ', '\n');
            break;
          case 'bold':
            insertMarkdown('**', '**');
            break;
          case 'italic':
            insertMarkdown('_', '_');
            break;
          case 'quote':
            insertMarkdown('> ', '\n');
            break;
          case 'code':
            insertMarkdown('```\n', '\n```');
            break;
          case 'link':
            insertMarkdown('[', '](url)');
            break;
          case 'bulletList':
            insertMarkdown('- ', '\n');
            break;
          case 'numberList':
            insertMarkdown('1. ', '\n');
            break;
          case 'file':
            fileInputRef.current?.click();
            break;
          default:
            break;
        }
      },
      [insertMarkdown],
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target && typeof event.target.result === 'string') {
            const fileId = generateFileId();

            if (file.type.startsWith('image/')) {
              setUploadedFiles((prev) => ({
                ...prev,
                [fileId]: event.target.result as string,
              }));

              const fileName = file.name.replace(/\.[^/.]+$/, '');
              insertMarkdown(`![${fileName}](https://questify.dev/assets/${fileId})`, '');
            } else {
              setUploadedFiles((prev) => ({
                ...prev,
                [fileId]: file.name,
              }));

              insertMarkdown(`[${file.name}](https://questify.dev/assets/${fileId})`, '');
            }
          }
        };

        reader.readAsDataURL(file);
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    const generateFileId = () => {
      return Array.from({ length: 4 }, () =>
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, '0'),
      ).join('-');
    };

    const renderHTML = (): { __html: string } => {
      let previewMarkdown = markdown;

      Object.entries(uploadedFiles).forEach(([fileId, dataUrl]) => {
        const questifyStyleUrl = `https://questify.dev/assets/${fileId}`;
        const regex = new RegExp(questifyStyleUrl, 'g');

        if (dataUrl.startsWith('data:')) {
          previewMarkdown = previewMarkdown.replace(regex, dataUrl);
        }
      });

      const html = marked.parse(previewMarkdown) as string;
      return { __html: html };
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter') {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const value = textarea.value;
        const selectionStart = textarea.selectionStart;

        const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
        const currentLine = value.substring(lineStart, selectionStart);

        const unorderedListMatch = currentLine.match(/^(\s*)- (.*)$/);
        if (unorderedListMatch) {
          e.preventDefault();

          const [, indent, text] = unorderedListMatch;

          if (!text.trim()) {
            const newValue = value.substring(0, lineStart) + value.substring(selectionStart);

            setMarkdown(newValue);

            setTimeout(() => {
              textarea.selectionStart = textarea.selectionEnd = lineStart;
            }, 0);

            return;
          }

          const insertion = `\n${indent}- `;
          const newValue =
            value.substring(0, selectionStart) + insertion + value.substring(selectionStart);

          setMarkdown(newValue);

          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = selectionStart + insertion.length;
          }, 0);

          return;
        }

        const orderedListMatch = currentLine.match(/^(\s*)(\d+)(\.\s)(.*)$/);
        if (orderedListMatch) {
          e.preventDefault();

          const [, indent, num, separator, text] = orderedListMatch;

          if (!text.trim()) {
            const newValue = value.substring(0, lineStart) + value.substring(selectionStart);

            setMarkdown(newValue);

            setTimeout(() => {
              textarea.selectionStart = textarea.selectionEnd = lineStart;
            }, 0);

            return;
          }

          const nextNum = Number.parseInt(num) + 1;
          const insertion = `\n${indent}${nextNum}${separator}`;
          const newValue =
            value.substring(0, selectionStart) + insertion + value.substring(selectionStart);

          setMarkdown(newValue);

          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = selectionStart + insertion.length;
          }, 0);

          return;
        }
      }
    };

    const handleMarkdownChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMarkdown(e.target.value);
      // Height will be adjusted in the useEffect that monitors markdown
    };

    return (
      <div className={styles.editorContainer}>
        <div className={styles.toolbar}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'write' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('write')}
            >
              Write
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'preview' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('preview')}
            >
              Preview
            </button>
          </div>

          {activeTab === 'write' && (
            <div className={styles.toolbarButtons}>
              <button
                className={styles.toolbarButton}
                onClick={() => handleToolbarAction('heading')}
                title="Heading"
              >
                <Heading1 />
              </button>
              <button
                className={styles.toolbarButton}
                onClick={() => handleToolbarAction('bold')}
                title="Bold"
              >
                <Bold />
              </button>
              <button
                className={styles.toolbarButton}
                onClick={() => handleToolbarAction('italic')}
                title="Italic"
              >
                <Italic />
              </button>
              <button
                className={styles.toolbarButton}
                onClick={() => handleToolbarAction('quote')}
                title="Quote"
              >
                <Quote />
              </button>
              <button
                className={styles.toolbarButton}
                onClick={() => handleToolbarAction('code')}
                title="Code"
              >
                <Code />
              </button>
              <button
                className={styles.toolbarButton}
                onClick={() => handleToolbarAction('link')}
                title="Link"
              >
                <LinkIcon />
              </button>
              <button
                className={styles.toolbarButton}
                onClick={() => handleToolbarAction('bulletList')}
                title="Bullet List"
              >
                <List />
              </button>
              <button
                className={styles.toolbarButton}
                onClick={() => handleToolbarAction('numberList')}
                title="Numbered List"
              >
                <ListOrdered />
              </button>
              <button
                className={styles.toolbarButton}
                onClick={() => handleToolbarAction('file')}
                title="Attach File"
              >
                <FileUp />
              </button>
            </div>
          )}
        </div>

        <div className={styles.content}>
          {activeTab === 'write' && (
            <div className={styles.writeTab}>
              <textarea
                ref={textareaRef}
                value={markdown}
                onChange={handleMarkdownChange}
                onKeyDown={handleKeyDown}
                className={styles.textarea}
                placeholder="Enter Description"
                style={{ border: 'none', overflow: 'hidden', resize: 'none' }}
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className={styles.fileInput}
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
            </div>
          )}

          {activeTab === 'preview' && (
            <div className={styles.previewTab}>
              {markdown ? (
                <div className={styles.preview} dangerouslySetInnerHTML={renderHTML()} />
              ) : (
                <div className={styles.emptyPreview}>Nothing to preview</div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
);

export default EditorContainer;
