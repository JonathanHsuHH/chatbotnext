import { PromptSuggestion, awesomePrompts } from '../utils/AwesomePromots'
import { useContext, useEffect, useRef, useState } from 'react'

import { ConversationContext } from './Context';

const slashCommands: PromptSuggestion[] = awesomePrompts

const SlashCommandItem = (props: {
    command: PromptSuggestion,
    onclick: (command: PromptSuggestion) => void
    active?: boolean
    activeRef: any
}) => {
    return (
        <div className={`flex-col p-3 gap-3 hover:bg-[#2A2B32] cursor-pointer text-white
                        ${props.active ? 'bg-gray-800' : ''}`}
            onClick={() => props.onclick(props.command)}
            ref={props.activeRef}
        >
            <div className="flex flex-row items-center justify-between" title={props.command.prompt}>
                    <div className="text-sm font-bold">{props.command.cmd}</div>
                    <div className="text-sm">{props.command.act}</div>
            </div>
        </div>
    )
}

function SlashCommandsMenu(
    props: {
        textarea: HTMLTextAreaElement | null,
    }
) {
    const { pluginConfig } = useContext(ConversationContext)
    const [showMenu, setShowMenu] = useState<boolean>(false)
    const [activeElementIndex, setActiveElementIndex] = useState<number>(0)
    const [filter, setFilter] = useState<string>('')
    const [filteredCommands, setFilteredCommands] = useState<PromptSuggestion[]>(slashCommands)
    const activeItemRef = useRef<HTMLDivElement|null>(null)


    const onTextAreaInput = (e: Event) => updateFilter(e)

    const onTextAreaKeyDown = (e: KeyboardEvent) => {

        if (!showMenu) return

        if (e.key === 'ArrowUp') {
            e.preventDefault()
            setActiveElementIndex(prevIndex => Math.max(prevIndex - 1, 0))
            const active = activeItemRef.current;
            if (active?.previousElementSibling) {
                (active.previousElementSibling as HTMLElement).scrollIntoView({block: "end", inline: "nearest"})
            }
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setActiveElementIndex(prevIndex => Math.min(prevIndex + 1, filteredCommands.length - 1))
            const active = activeItemRef.current;
            if (active?.nextElementSibling) {
                (active.nextElementSibling as HTMLElement).scrollIntoView({block: "end", inline: "nearest"})
            }
        }

        if (e.key === 'Tab' || e.key === 'Enter') {
            e.preventDefault()
            const command = filteredCommands[activeElementIndex]
            onCommandClick(command)
        }
    }

    function updateFilter(e: Event) {
        const text = (e.target as HTMLTextAreaElement).value
        if (text.startsWith('/')) {
            setFilter(text)
        } else {
            setFilter('')
        }
        setActiveElementIndex(0)
    }

    const onCommandClick = (command: PromptSuggestion) => {
        if (!command) return
        setTextAreaValue(command.prompt, true)
        setShowMenu(false)
    }

    function setTextAreaValue(value: string, dispatchEvent = true) {
        if  (!props.textarea) return
        props.textarea.value = value
        if (dispatchEvent) {
            props.textarea.dispatchEvent(new Event('promptExpand', {value} as any))
        }
        props.textarea.focus()
    }

    useEffect(() => {
        props.textarea?.addEventListener('input', onTextAreaInput)
        props.textarea?.addEventListener('keydown', onTextAreaKeyDown)

        return function cleanup() {
            props.textarea?.removeEventListener('input', onTextAreaInput)
            props.textarea?.removeEventListener('keydown', onTextAreaKeyDown)
        }
    })

    useEffect(() => {
        if (filter === '') {
            setShowMenu(false)
            return
        }
        const newFilteredCommands = slashCommands.filter((command) => command.cmd.startsWith(filter))
        setFilteredCommands(newFilteredCommands)
        setShowMenu(pluginConfig.usePromptSuggestion && newFilteredCommands.length > 0)

    }, [filter, pluginConfig.usePromptSuggestion])

    if (!showMenu) return null

    return (
        <div className={`w-full lg:max-w-3xl rounded-md bg-gray-900 shadow-[0_0_10px_rgba(0,0,0,0.10)]`}>
            <div className='px-3 p-2 text-xs text-white b-2 border-b border-white/20'>Awesome Prompts</div>
            <ul className={`max-h-52  flex-col flex-1 overflow-y-auto border border-white/20 `}>
                {filteredCommands.map((command) => {
                    return (
                        <SlashCommandItem
                            key={command.act}
                            command={command}
                            onclick={onCommandClick}
                            active={activeElementIndex === filteredCommands.indexOf(command)}
                            activeRef={activeElementIndex === filteredCommands.indexOf(command) ? activeItemRef : null}
                        />
                    )
                })}
            </ul>
        </div>
    )
}

export default SlashCommandsMenu