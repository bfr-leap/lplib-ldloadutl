import { readFileSync, writeFileSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';

import type { SubsessionTelemetry } from 'ir-endpoints-types';
import { notifyWrite } from './kafka-notify';

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

export async function getTelemetrySubsessionsAsync(
    leagueId: number
): Promise<number[] | null> {
    try {
        let ret: number[] = <number[]>JSON.parse(
            await readFile(`${MNT_PT}telemetrySubsessions/${leagueId}.json`, {
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

    notifyWrite('ldata-irrpy', 'telemetrySubsessions', [leagueId]);
}

export async function saveTelemetrySubsessionsAsync(
    leagueId: number,
    subsessions: number[]
): Promise<void> {
    let subsessionsJson = JSON.stringify(subsessions);

    await writeFile(
        `${MNT_PT}telemetrySubsessions/${leagueId}.json`,
        subsessionsJson,
        {
            encoding: 'utf8',
            flag: 'w',
        }
    );

    notifyWrite('ldata-irrpy', 'telemetrySubsessions', [leagueId]);
}

export function getTelemetryScan(
    leagueId: number,
    subsessionId: number
): SubsessionTelemetry | null {
    try {
        let strTelemetry: string = '';
        let nans = [/-nan\(ind\)/g, /nan\(ind\)/g, /inf/g, /-inf/g, /--1/g];

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

export async function getTelemetryScanAsync(
    leagueId: number,
    subsessionId: number
): Promise<SubsessionTelemetry | null> {
    try {
        let strTelemetry: string = '';
        let nans = [/-nan\(ind\)/g, /nan\(ind\)/g, /inf/g, /-inf/g, /--1/g];

        strTelemetry = await readFile(
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
