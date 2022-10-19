import React, {createContext, useContext} from "react";



export type GlobalMenuContent = {
    menu: string
    setMenu: (m: string) => void
}

export const MenuGlobalContext = createContext<GlobalMenuContent>({
    menu: 'Home',
    setMenu: () => {}
})

export const useMenuGlobalContext = () => useContext(MenuGlobalContext)