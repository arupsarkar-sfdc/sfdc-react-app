import React, {createContext, useContext} from "react";



export type GlobalRecentsContent = {
    recents: string
    setRecents: (m: string) => void
}

export const RecentsGlobalContext = createContext<GlobalRecentsContent>({
    recents: 'Recents',
    setRecents: () => {}
})

export const useRecentsGlobalContext = () => useContext(RecentsGlobalContext)