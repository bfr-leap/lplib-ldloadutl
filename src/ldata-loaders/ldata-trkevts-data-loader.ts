import { ldataWriteFile, ldataReadFile } from './fsutil';
import { OnTrackRaceEvents } from 'ir-endpoints-types';

const MNT_PT = './public/data/ldata-trkevts/';

export function getRawPositionChanges(
    leagueId: number,
    subsessionId: number,
    simsessionNumber: number
): OnTrackRaceEvents | null {
    return ldataReadFile<OnTrackRaceEvents>(MNT_PT, 'rawPositionChanges', [
        leagueId,
        subsessionId,
        simsessionNumber,
    ]);
}

export function getOnTrackOvertakes(
    leagueId: number,
    subsessionId: number,
    simsessionNumber: number
): OnTrackRaceEvents | null {
    return ldataReadFile<OnTrackRaceEvents>(MNT_PT, 'onTrackOvertakes', [
        leagueId,
        subsessionId,
        simsessionNumber,
    ]);
}

export function getOnTrackPitStops(
    leagueId: number,
    subsessionId: number,
    simsessionNumber: number
): OnTrackRaceEvents | null {
    return ldataReadFile<OnTrackRaceEvents>(MNT_PT, 'onTrackPitStops', [
        leagueId,
        subsessionId,
        simsessionNumber,
    ]);
}

export function getOnTrackIncidents(
    leagueId: number,
    subsessionId: number,
    simsessionNumber: number
): OnTrackRaceEvents | null {
    return ldataReadFile<OnTrackRaceEvents>(MNT_PT, 'onTrackIncidents', [
        leagueId,
        subsessionId,
        simsessionNumber,
    ]);
}

export function getOnTrackFinishingNotes(
    leagueId: number,
    subsessionId: number,
    simsessionNumber: number
): OnTrackRaceEvents | null {
    return ldataReadFile<OnTrackRaceEvents>(MNT_PT, 'onTrackFinishingNotes', [
        leagueId,
        subsessionId,
        simsessionNumber,
    ]);
}

export function saveRawPositionChanges(
    leagueId: number,
    subsessionId: number,
    simsessionNumber: number,
    dataset: OnTrackRaceEvents
): void {
    ldataWriteFile(dataset, MNT_PT, 'rawPositionChanges', [
        leagueId,
        subsessionId,
        simsessionNumber,
    ]);
}

export function saveOnTrackOvertakes(
    leagueId: number,
    subsessionId: number,
    simsessionNumber: number,
    dataset: OnTrackRaceEvents
): void {
    ldataWriteFile(dataset, MNT_PT, 'onTrackOvertakes', [
        leagueId,
        subsessionId,
        simsessionNumber,
    ]);
}

export function saveOnTrackPitStops(
    leagueId: number,
    subsessionId: number,
    simsessionNumber: number,
    dataset: OnTrackRaceEvents
): void {
    ldataWriteFile(dataset, MNT_PT, 'onTrackPitStops', [
        leagueId,
        subsessionId,
        simsessionNumber,
    ]);
}

export function saveOnTrackIncidents(
    leagueId: number,
    subsessionId: number,
    simsessionNumber: number,
    dataset: OnTrackRaceEvents
): void {
    ldataWriteFile(dataset, MNT_PT, 'onTrackIncidents', [
        leagueId,
        subsessionId,
        simsessionNumber,
    ]);
}

export function saveOnTrackFinishingNotes(
    leagueId: number,
    subsessionId: number,
    simsessionNumber: number,
    dataset: OnTrackRaceEvents
): void {
    ldataWriteFile(dataset, MNT_PT, 'onTrackFinishingNotes', [
        leagueId,
        subsessionId,
        simsessionNumber,
    ]);
}
