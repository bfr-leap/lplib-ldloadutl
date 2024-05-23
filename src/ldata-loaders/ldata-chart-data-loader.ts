import { ldataWriteFile, ldataReadFile } from './fsutil';
import { ChartTable } from 'ir-endpoints-types';

const MNT_PT = './public/data/ldata-charts/';

export function getStartFinishChartData(
    leagueId: number,
    subsessionId: number,
    simsessionNumber: number
): ChartTable | null {
    return ldataReadFile<ChartTable>(MNT_PT, 'startFinishChartData', [
        leagueId,
        subsessionId,
        simsessionNumber,
    ]);
}

export function saveStartFinishChartData(
    leagueId: number,
    subsessionId: number,
    simsessionNumber: number,
    dataset: ChartTable
): void {
    ldataWriteFile(dataset, MNT_PT, 'startFinishChartData', [
        leagueId,
        subsessionId,
        simsessionNumber,
    ]);
}

export function getCumulativeDeltaChartData(
    leagueId: number,
    subsessionId: number,
    simsessionNumber: number
): ChartTable | null {
    return ldataReadFile<ChartTable>(MNT_PT, 'cumulativeDeltaChartData', [
        leagueId,
        subsessionId,
        simsessionNumber,
    ]);
}

export function saveCumulativeDeltaChartData(
    leagueId: number,
    subsessionId: number,
    simsessionNumber: number,
    dataset: ChartTable
): void {
    ldataWriteFile(dataset, MNT_PT, 'cumulativeDeltaChartData', [
        leagueId,
        subsessionId,
        simsessionNumber,
    ]);
}

export function saveCumulativeDeltaBestLapChartData(
    leagueId: number,
    subsessionId: number,
    simsessionNumber: number,
    dataset: ChartTable
): void {
    ldataWriteFile(dataset, MNT_PT, 'cumulativeDeltaBestLapChartData', [
        leagueId,
        subsessionId,
        simsessionNumber,
    ]);
}
export function savePacePercentVsIdealLapChartData(
    leagueId: number,
    subsessionId: number,
    simsessionNumber: number,
    dataset: ChartTable
): void {
    ldataWriteFile(dataset, MNT_PT, 'pacePercentVsIdealLapChartData', [
        leagueId,
        subsessionId,
        simsessionNumber,
    ]);
}
export function savePacePercentChartData(
    leagueId: number,
    subsessionId: number,
    simsessionNumber: number,
    dataset: ChartTable
): void {
    ldataWriteFile(dataset, MNT_PT, 'pacePercentChartData', [
        leagueId,
        subsessionId,
        simsessionNumber,
    ]);
}