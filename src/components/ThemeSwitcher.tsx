"use client"
import {useEffect, useState} from 'react'

function ThemeSwitcher() {
    const [dark,setDark] = useState(false);
    useEffect(()=>{
      const savedTheme = localStorage.getItem('theme');
      if(savedTheme == 'dark-mode'){
        setDark(true);
        document.body.classList.add('dark-mode');
      }
    },[])
    useEffect(()=>{
      if(dark){
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark-mode');
      }else{
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', '');
      }
    })
  return (
<button id="theme-switcher" className="theme-switcher" onClick={()=>setDark(!dark)}>Change Theme</button>
  )
}

export default ThemeSwitcher