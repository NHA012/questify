import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // For GitHub Flavored Markdown
import rehypeHighlight from 'rehype-highlight'; // For code syntax highlighting

const MarkdownRenderer = ({ markdownContent }) => {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Custom component overrides
          h1: ({ ...props }) => <h1 className="text-2xl font-bold my-4" {...props} />,
          h2: ({ ...props }) => <h2 className="text-xl font-bold my-3" {...props} />,
          p: ({ ...props }) => <p className="my-2" {...props} />,
          a: ({ href, ...props }) => (
            <a
              href={href}
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          // Add more component overrides as needed
        }}
      >
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
