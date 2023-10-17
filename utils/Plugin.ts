import {postWrapper} from '../utils/api/fetchWrapper';
import toast from 'react-hot-toast'

export interface PluginConfig {
    usePromptSuggestion: boolean;
    useSearch: boolean;
    searchEngine: SearchEngineEnum;
    searchResultNum: NumberInRange;
    useGPT4: boolean;
};

export type NumberInRange = 1 | 3 | 5 | 10;

export enum SearchEngineEnum {
    Google = 'Google',
    Bing = 'Bing',
    Baidu = 'Baidu'
};

export enum ModelVersion {
    gpt35 = 'gpt35',
    gpt4 = 'gpt4'
};

export async function webSearch(queryText: string, resultNum: number, searchEngine: SearchEngineEnum) {
    switch (searchEngine) {
        case SearchEngineEnum.Google:
            return await googleSearch(queryText, resultNum)
        case SearchEngineEnum.Bing:
            return await bingSearch(queryText, resultNum)
        /*
        case SearchEngineEnum.Baidu:
            return await baiduSearch(queryText, resultNum)*/
        default:
            return await googleSearch(queryText, resultNum)
    }
}

export async function googleSearch(queryText: string, resultNum: number) {
    const response = await postWrapper('/api/googleSearch', JSON.stringify({queryText: queryText, resultNum: resultNum}));
    if (response.ok) {
        const result = await response.json()
        if (result.error) {
            toast.error(`webSearch Error: ${result.error.message}`)
            return {ok: false}
        } else {
            const queryResult = result.data.items.map((item: any, index: number) => {
                let snippet = item.snippet
                const maintextIndex = item.snippet.indexOf(" ... ")
                if (maintextIndex> 0) {
                    snippet = item.snippet.slice(maintextIndex + 5)
                }
                return `[${index + 1}] "${snippet}"\nURL: ${item.link}`
            })
            return {data: queryResult.join("\n\n"), ok: true}
        }
    } else {
        return {ok: false}
    }
}

export async function bingSearch(queryText: string, resultNum: number) {
    const response = await postWrapper('/api/bingSearch', JSON.stringify({queryText: queryText, resultNum: resultNum}));
    if (response.ok) {
        const result = await response.json()
        if (result.error) {
            toast.error(`webSearch Error: ${result.error.message}`)
            return {ok: false}
        } else {
            const queryResult = result.data.webPages.value.map((item: any, index: number) => {
                return `[${index + 1}] "${item.snippet}"\nURL: ${item.url}`
            })
            return {data: queryResult.join("\n\n"), ok: true}
        }
    } else {
        return {ok: false}
    }
}