import React, { FunctionComponent } from "react"
import { AccountTable } from "./accountTable"
import { AddAccountModal } from "./addAccountModal"
import { Header } from "./base/header"
import { Organization } from "../types/organization";
import "../styles/sidebar.scss";
import { AccountSummary } from "./accountSummary";

interface SidebarProps {
    organizations: Organization[],
    setTransactionFilter: Function,
    addAccount: Function
}

export const Sidebar: FunctionComponent<SidebarProps> = ({ organizations, setTransactionFilter, addAccount }) => {
    return (
        <div className="sidebar" >
            <AccountSummary organizations={organizations} />
            <AccountTable organizations={organizations} selectAccountCallback={setTransactionFilter} />
            <AddAccountModal addAccountCallback={addAccount} />
        </div>
    )
}