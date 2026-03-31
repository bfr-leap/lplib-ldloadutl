import { ldataWriteFile, ldataReadFile } from './fsutil';
import type {
    GeneratedSimsessionSummary,
    DotdProfileData,
    DotdManifestEntry,
} from 'ir-endpoints-types';

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

export function getDotdProfile(
    leagueId: number,
    custId: number
): DotdProfileData | null {
    return ldataReadFile<DotdProfileData>(MNT_PT, 'dotdProfile', [
        leagueId,
        custId,
    ]);
}

export function saveDotdProfile(
    leagueId: number,
    custId: number,
    profile: DotdProfileData
): void {
    ldataWriteFile(profile, MNT_PT, 'dotdProfile', [
        leagueId,
        custId,
    ]);
}

export function getDotdManifest(
    leagueId: number,
    seasonId: number
): DotdManifestEntry[] {
    return (
        ldataReadFile<DotdManifestEntry[]>(MNT_PT, 'dotdManifest', [
            leagueId,
            seasonId,
        ]) ?? []
    );
}

export function saveDotdManifest(
    leagueId: number,
    seasonId: number,
    manifest: DotdManifestEntry[]
): void {
    ldataWriteFile(manifest, MNT_PT, 'dotdManifest', [leagueId, seasonId]);
}
