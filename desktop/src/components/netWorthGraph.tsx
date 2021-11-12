import React, { FunctionComponent, useEffect, useState } from "react"
import { Account } from "../model/account"
import { Entry } from "../model/entry"
import { Card } from "./base/card"
import "../styles/netWorthGraph.scss";

type NetWorthGraphProps = {
    entries: Entry[],
    accounts: Account[]
}

const MILLISECONDS_PER_DAY = 60000 * 60 * 24;

export const NetWorthGraph: FunctionComponent<NetWorthGraphProps> = ({ accounts, entries }) => {
    const [chartData, setChartData] = useState<any[]>([]);
    const graphDuration = MILLISECONDS_PER_DAY * 90;
    const graphInterval = MILLISECONDS_PER_DAY;

    useEffect(() => {
        const now = new Date();
        const graphStart = new Date(now.valueOf() - graphDuration);
        let currentDate = graphStart;
        let points = [];
        while (currentDate < now) {
            points.push({
                date: `${currentDate.getDay()}/${currentDate.getMonth()}/${currentDate.getFullYear().toString().slice(2, 4)}`,
                value: accounts.map((account) => account.getValue(entries)).reduce((total, current) => total + current, 0)
            });
            currentDate = new Date(currentDate.valueOf() + graphInterval);
        }
        setChartData(points);
    }, [accounts, entries, graphDuration, graphInterval]);

    return (
        <Card>
            Chart here
        </Card>
    )
}