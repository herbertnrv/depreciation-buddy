import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { DEFAULT_SETTINGS, type Settings } from './asset-model';
import { getSettings, saveSettings } from './local-db';
const Context=createContext({ settings:DEFAULT_SETTINGS, update:async (_:Settings)=>{}, refresh:async()=>{} });
export function SettingsProvider({children}:{children:ReactNode}) {
 const [settings,setSettings]=useState(DEFAULT_SETTINGS);
 const refresh=async()=>setSettings(await getSettings());
 useEffect(()=>{void refresh();},[]);
 return <Context.Provider value={{settings,refresh,update:async value=>{await saveSettings(value);setSettings(value);}}}>{children}</Context.Provider>;
}
export const useSettings=()=>useContext(Context);
export function useUnsaved(dirty:boolean) {useEffect(()=>{const handler=(e:BeforeUnloadEvent)=>{if(dirty){e.preventDefault();e.returnValue='';}};window.addEventListener('beforeunload',handler);return()=>window.removeEventListener('beforeunload',handler);},[dirty]);}
