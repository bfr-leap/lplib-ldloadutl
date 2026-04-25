/**
 *
 * This TypeScript module imports the readFileSync function from the 'fs' (file system) module and the
 * SimsessionResults type from an external module 'ir-endpoints-types'. It defines a function
 * getSimSessionResults that takes a subsessionId and a simsessionNumber as parameters. This function
 * reads and parses a JSON file named based on the provided ids, located in the './public/data/derived/'
 * directory, and returns the parsed SimsessionResults object.
 *
 */

import { readFileSync } from 'fs';
import { readFile } from 'fs/promises';

import type {
    SimsessionResults,
    SeasonSimsessionIndex,
    ST_DriverTelemetry,
} from 'ir-endpoints-types';
import {
    ldataReadFile,
    ldataReadFileAsync,
    ldataWriteFile,
    ldataWriteFileAsync,
} from './fsutil';

const MNT_PT = './public/data/ldata-rsltsts/';

export function getSimSessionResults(
    subsessionId: number,
    simsessionNumber: number
): SimsessionResults {
    let simsessionStr =
        simsessionNumber < 0 ? `n${-simsessionNumber}` : `${simsessionNumber}`;
    let ret: SimsessionResults = <SimsessionResults>JSON.parse(
        readFileSync(
            `${MNT_PT}simSessionResults/${subsessionId}/${simsessionStr}.json`,
            {
                encoding: 'utf8',
                flag: 'r',
            }
        )
    );

    return ret;
}

export async function getSimSessionResultsAsync(
    subsessionId: number,
    simsessionNumber: number
): Promise<SimsessionResults> {
    let simsessionStr =
        simsessionNumber < 0 ? `n${-simsessionNumber}` : `${simsessionNumber}`;
    let ret: SimsessionResults = <SimsessionResults>JSON.parse(
        await readFile(
            `${MNT_PT}simSessionResults/${subsessionId}/${simsessionStr}.json`,
            {
                encoding: 'utf8',
                flag: 'r',
            }
        )
    );

    return ret;
}

export function getLeaguSubsessionIndex(
    leagueId: number
): SeasonSimsessionIndex[] {
    let ret: SeasonSimsessionIndex[] = <SeasonSimsessionIndex[]>JSON.parse(
        readFileSync(`${MNT_PT}leagueSimsessionIndex/${leagueId}.json`, {
            encoding: 'utf8',
            flag: 'r',
        })
    );

    return ret;
}

export async function getLeaguSubsessionIndexAsync(
    leagueId: number
): Promise<SeasonSimsessionIndex[]> {
    let ret: SeasonSimsessionIndex[] = <SeasonSimsessionIndex[]>JSON.parse(
        await readFile(`${MNT_PT}leagueSimsessionIndex/${leagueId}.json`, {
            encoding: 'utf8',
            flag: 'r',
        })
    );

    return ret;
}

export function getSimsessionDriverTelemetry(
    subssesion: number,
    simsession: number,
    driver: number
): ST_DriverTelemetry {
    let simsessionStr = simsession < 0 ? `n${-simsession}` : `${simsession}`;
    let ret: ST_DriverTelemetry = <ST_DriverTelemetry>JSON.parse(
        readFileSync(
            `${MNT_PT}simsessionDriverTelemetry/${subssesion}/${simsessionStr}/${driver}.json`,
            {
                encoding: 'utf8',
                flag: 'r',
            }
        )
    );

    return ret;
}

export async function getSimsessionDriverTelemetryAsync(
    subssesion: number,
    simsession: number,
    driver: number
): Promise<ST_DriverTelemetry> {
    let simsessionStr = simsession < 0 ? `n${-simsession}` : `${simsession}`;
    let ret: ST_DriverTelemetry = <ST_DriverTelemetry>JSON.parse(
        await readFile(
            `${MNT_PT}simsessionDriverTelemetry/${subssesion}/${simsessionStr}/${driver}.json`,
            {
                encoding: 'utf8',
                flag: 'r',
            }
        )
    );

    return ret;
}

const DATASET_PROCESSED_TELEMETRY = 'processedTelemetryManifest';

export function getProcessedTelemetryManifest(leagueId: number): Set<number> {
    const data = ldataReadFile<number[]>(MNT_PT, DATASET_PROCESSED_TELEMETRY, [
        leagueId,
    ]);
    if (data === null) {
        return new Set();
    }
    return new Set<number>(data);
}

export async function getProcessedTelemetryManifestAsync(
    leagueId: number
): Promise<Set<number>> {
    const data = await ldataReadFileAsync<number[]>(
        MNT_PT,
        DATASET_PROCESSED_TELEMETRY,
        [leagueId]
    );
    if (data === null) {
        return new Set();
    }
    return new Set<number>(data);
}

export function saveProcessedTelemetryManifest(
    leagueId: number,
    subsessionIds: Set<number>
): void {
    ldataWriteFile(
        Array.from(subsessionIds),
        MNT_PT,
        DATASET_PROCESSED_TELEMETRY,
        [leagueId]
    );
}

export async function saveProcessedTelemetryManifestAsync(
    leagueId: number,
    subsessionIds: Set<number>
): Promise<void> {
    await ldataWriteFileAsync(
        Array.from(subsessionIds),
        MNT_PT,
        DATASET_PROCESSED_TELEMETRY,
        [leagueId]
    );
}
