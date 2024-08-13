import { ReactNode } from "react"

type FormWrapperProps ={
    title: string
    children: ReactNode
}

export function FormWrapper({title, children}: FormWrapperProps){


    return <>
    <h2 style={{textAlign: "center", margin: 0}}>{title}</h2>

    <div style={{
    justifyContent: "flex-start", 
    gridTemplateColumns: "auto minmax (auto, 400px)"

     }}>{children}</div>
  
    </>
}