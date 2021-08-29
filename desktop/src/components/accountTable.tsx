import React, { FunctionComponent } from "react";
import "../styles/accountTable.scss";
import { Organization } from "../types/organization";
import { OrganizationSummary } from "./organizationSummary";

type AccountTableProps = {
    organizations: Organization[],
    selectAccountCallback: Function
}

export const AccountTable: FunctionComponent<AccountTableProps> = ({ organizations, selectAccountCallback }) => {
    return (
        <div className="account-table">
            {
                organizations.map((organization) => (
                    <OrganizationSummary organization={organization} />
                ))
            }
        </div>
    );
}
