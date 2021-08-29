import React, { FunctionComponent } from "react"
import { AccountTable } from "./accountTable"
import { AddAccountModal } from "./addAccountModal"
import "../styles/sidebar.scss";
import { PortfolioSummary } from "./portfolioSummary";
import { Account } from "../model/account";
import { Entry } from "../model/entry";

interface SidebarProps {
    accounts: Account[],
    entries: Entry[]
}

export const Sidebar: FunctionComponent<SidebarProps> = ({ accounts, entries }) => {
    return (
        <div className="sidebar" >
            {
                accounts.map((account) => (
                    <div>
                        <p>{account.name}</p>
                        <p>{account.getEntries(entries).reduce((total, entry) => { return total + entry.amount }, 0)}</p>
                    </div>
                ))
            }
        </div>
    )
}