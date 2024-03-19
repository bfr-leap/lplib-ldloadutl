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
    leagueId: number,
    subsessionId: number
): SubsessionTelemetry | null {
    try {
        let strTelemetry: string = '';
        let nans = [/-nan\(ind\)/g, /nan\(ind\)/g, /inf/g];

        strTelemetry = readFileSync(
            `${MNT_PT}telemetryScans/${leagueId}/${subsessionId}.json`,
            {
                encoding: 'utf8',
                flag: 'r',
            }
        );

        for (let nan of nans) {
            strTelemetry = strTelemetry.replace(nan, '-1');
        }

        let ret: SubsessionTelemetry = <SubsessionTelemetry>(
            JSON.parse(strTelemetry)
        );

        return ret;
    } catch (e) {
        return null;
    }
}
