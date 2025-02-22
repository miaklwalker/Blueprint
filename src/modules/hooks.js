import {useContext} from "react";
import {useStore} from "zustand";
import {StoreContext} from "../components/provider/provider.jsx";

export function useBlueprintStore(selector) {
    const blueprintStore = useContext(StoreContext);
    return useStore(blueprintStore, selector)
}