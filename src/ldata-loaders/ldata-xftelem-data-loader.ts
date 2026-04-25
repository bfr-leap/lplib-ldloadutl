import { readFileSync } from 'fs';
import { readFile } from 'fs/promises';
import { EpochTelemetry } from 'ir-endpoints-types';
import { ldataWriteFile, ldataWriteFileAsync } from './fsutil';

const MNT_PT = './public/data/ldata-xftelem/';

export function getReconstructedTelemetry(
    leagueId: number,
    subsessionId: number,
    simsessionNumber: number
): EpochTelemetry | null {
    let simsessionStr =
        simsessionNumber < 0 ? `n${-simsessionNumber}` : `${simsessionNumber}`;
    try {
        let ret: any = JSON.parse(
            readFileSync(
                `${MNT_PT}reconstructedTelemetry/${leagueId}/${subsessionId}/${simsessionStr}.json`,
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

export async function getReconstructedTelemetryAsync(
    leagueId: number,
    subsessionId: number,
    simsessionNumber: number
): Promise<EpochTelemetry | null> {
    let simsessionStr =
        simsessionNumber < 0 ? `n${-simsessionNumber}` : `${simsessionNumber}`;
    try {
        let ret: any = JSON.parse(
            await readFile(
                `${MNT_PT}reconstructedTelemetry/${leagueId}/${subsessionId}/${simsessionStr}.json`,
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

export function writeReconstructedTelemetry(
    leagueId: number,
    subsessionId: number,
    simsessionNumber: number,
    telemetry: EpochTelemetry
): void {
    ldataWriteFile(telemetry, MNT_PT, `reconstructedTelemetry`, [
        leagueId,
        subsessionId,
        simsessionNumber,
    ]);
}

export async function writeReconstructedTelemetryAsync(
    leagueId: number,
    subsessionId: number,
    simsessionNumber: number,
    telemetry: EpochTelemetry
): Promise<void> {
    await ldataWriteFileAsync(telemetry, MNT_PT, `reconstructedTelemetry`, [
        leagueId,
        subsessionId,
        simsessionNumber,
    ]);
}
