import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { EpochTelemetry } from 'ir-endpoints-types';

const MNT_PT = './public/data/ldata-xftelem/';

function wf(obj: any, name: string) {
    name = name.replace(/-/g, 'n');
    const ids = name.split('.')[0].split('_');
    const path = `${MNT_PT}${ids.slice(0, -1).join('/')}/`;
    if (!existsSync(path)) {
        mkdirSync(path, { recursive: true });
    }
    let newName = ids[ids.length - 1];
    writeFileSync(`${path}${newName}.json`, JSON.stringify(obj));
}

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

export function exportReconstructedTelemetry(
    leagueId: number,
    subsessionId: number,
    simsessionNumber: number,
    telemetry: EpochTelemetry
): void {
    wf(
        telemetry,
        `reconstructedTelemetry_${leagueId}_${subsessionId}_${simsessionNumber}.json`
    );
}
