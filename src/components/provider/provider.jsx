import {createContext, useRef} from "react";
import {createBlueprintStore} from "../../modules/store.js";

export const StoreContext = createContext(null)

export function StoreProvider({children}) {
    const store = useRef(createBlueprintStore).current
    return (
        <StoreContext.Provider value={store}>
            {children}
        </StoreContext.Provider>
    )
}