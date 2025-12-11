import React from 'react';
import ReactMarkdown from 'react-markdown';

interface Props {
  content: string;
}

export const MarkdownView: React.FC<Props> = ({ content }) => {
  return (
    <div className="prose prose-invert prose-sm max-w-none">
      <ReactMarkdown
        components={{
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match && !String(children).includes('\n');
            return !isInline ? (
              <div className="relative group">
                <pre className="bg-slate-900/50 p-4 rounded-lg overflow-x-auto border border-slate-700/50 my-4">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            ) : (
              <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-200 text-sm font-mono" {...props}>
                {children}
              </code>
            );
          },
          a({ node, href, children, ...props }) {
             return (
               <a 
                 href={href} 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="text-blue-400 hover:text-blue-300 underline"
                 {...props}
               >
                 {children}
               </a>
             )
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};