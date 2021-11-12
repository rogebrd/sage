import { Container } from "@material-ui/core"
import { FunctionComponent } from "react"

type CardProps = {

}

export const Card: FunctionComponent<CardProps> = ({ children }) => {
    return (
        <Container className="card">
            <div className="card--holder">
                {children}
            </div>
        </Container>
    )
}