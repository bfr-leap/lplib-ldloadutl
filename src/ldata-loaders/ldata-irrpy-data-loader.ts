import { readFileSync, writeFileSync } from 'fs';

import type { SubsessionTelemetry } from 'ir-endpoints-types';

const MNT_PT = './public/data/ldata-irrpy/';

export function getTelemetrySubsessions(leagueId: number): number[] | null {
    try {
        let ret: number[] = <number[]>JSON.parse(
            readFileSync(`${MNT_PT}telemetrySubsessions/${leagueId}.json`, {
                encoding: 'utf8',
                flag: 'r',
            })
        );

        return ret;
    } catch (e) {
        return null;
    }
}

export function saveTelemetrySubsessions(
    leagueId: number,
    subsessions: number[]
): void {
    let subsessionsJson = JSON.stringify(subsessions);

    writeFileSync(
        `${MNT_PT}telemetrySubsessions/${leagueId}.json`,
        subsessionsJson,
        {
            encoding: 'utf8',
            flag: 'w',
        }
    );
}

export function getTelemetryScan(
    leagueId: string,
    subsessionId: string
): SubsessionTelemetry {
    try {
        let ret: SubsessionTelemetry = <SubsessionTelemetry>JSON.parse(
            readFileSync(
                `${MNT_PT}telemetryScans/${leagueId}/${subsessionId}.json`,
                {
                    encoding: 'utf8',
                    flag: 'r',
                }
            )
        );

        return ret;
    } catch (e) {
        return null;
    }
}
