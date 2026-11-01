import type React from 'react'
import {  useState } from "react";
import { CounterContext } from "./CounterContext";



export default function CounterContextProvider( {children} : {children: React.ReactNode} ) {

    const [counter, setCounter] = useState(10) ; 
  return (
    <>
      <CounterContext.Provider value={{counter, setCounter}}>
        {children}
      </CounterContext.Provider>
    </>
  )
}
