import { ldataWriteFile, ldataReadFile } from './fsutil';
import { GeneratedSimsessionSummary } from 'ir-endpoints-types';

const MNT_PT = './public/data/ldata-gentxt/';

export function getSimsessionSummary(
    subsessionId: number,
    simsessionNumber: number
): GeneratedSimsessionSummary | null {
    return ldataReadFile<GeneratedSimsessionSummary>(
        MNT_PT,
        'simsessionSummary',
        [subsessionId, simsessionNumber]
    );
}

export function saveSimsessionSummary(
    subsessionId: number,
    simsessionNumber: number,
    dataset: GeneratedSimsessionSummary
): void {
    ldataWriteFile(dataset, MNT_PT, 'simsessionSummary', [
        subsessionId,
        simsessionNumber,
    ]);
}

// todo: add [get/save]SimsessionHighlight/
