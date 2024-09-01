import React, { MouseEventHandler } from 'react'
import "../../styles/Button.css"

interface Props {
    children?: string
    link: string
    onclick?: MouseEventHandler
    displayType?: string
}

const Button: React.FC<Props> = ({ children, link, onclick, displayType }) => {

    const hasLink = link && link.trim() !== '';
    const buttonType = displayType ? displayType : "btn-dark"

    return hasLink ? (
        <>
            <a href={link} id="btn-link"><button type="button" className={"btn " + buttonType} id="btn-panel">{children}</button></a>
        </>
    ) : (
        <>
            <a id="btn-link" type="submit"><button type="submit" className={"btn " + buttonType} id="btn-panel" onClick={onclick}>{children}</button></a>
        </>
    )
}

export default Button