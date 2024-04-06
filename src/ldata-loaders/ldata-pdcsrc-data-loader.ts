import { ldataWriteFile, ldataReadFile } from './fsutil';
import { PodcastScriptedSrc } from 'ir-endpoints-types';


const MNT_PT = './public/data/ldata-pdcsrc/';

export function getSimsessionPodcastScriptedSrc(
    subsessionId: number,
    simsessionNumber: number
): PodcastScriptedSrc | null {
    return ldataReadFile<PodcastScriptedSrc>(
        MNT_PT,
        'simsessionPodcastScriptedSrc',
        [subsessionId, simsessionNumber]
    );
}

export function saveSimsessionPodcastScriptedSrc(
    subsessionId: number,
    simsessionNumber: number,
    dataset: PodcastScriptedSrc
): void {
    ldataWriteFile(dataset, MNT_PT, 'simsessionPodcastScriptedSrc', [
        subsessionId,
        simsessionNumber,
    ]);
}

