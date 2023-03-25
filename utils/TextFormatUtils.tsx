
// urlText example: [[2](https://www.nbcnews.com/tech/tiktok-proposed-ban-users-creators-react-rcna75456)]
export function replaceUrlWithHyerlinkTag(urlText: string) {
    return urlText.replace(/\[\[(.*?)\]\((.*?)\)\]/g, "<a href='$2'>[$1]</a>")
}

export const formatBotMessage = (text: string) => 
    text.split('\n').map((line, i) => (
        <span key={i}>
            <article className="prose" dangerouslySetInnerHTML={{ __html: replaceUrlWithHyerlinkTag(line) }} />
            <br />
        </span>
        )
    )
  
export const formatUserMessage = (text: string) => 
    text.split('\n').map((line, i) => (
        <span key={i}>
            {line}
            <br />
        </span>
        )
    )
