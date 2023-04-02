import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'

export const formatBotMessage = (text: string) => 
    <ReactMarkdown linkTarget="_blank" rehypePlugins={[rehypeHighlight]}>{text}</ReactMarkdown>
  
export const formatUserMessage = (text: string) => 
    text.split('\n').map((line, i) => (
        <span key={i}>
            {line}
            <br />
        </span>
        )
    )
