jest.mock('fs');
jest.mock('./kafka-notify', () => ({ notifyWrite: jest.fn() }));

import { readFileSync, writeFileSync, existsSync } from 'fs';
import {
    getStartFinishChartData,
    saveStartFinishChartData,
    getCumulativeDeltaChartData,
    saveCumulativeDeltaChartData,
    saveCumulativeDeltaBestLapChartData,
    savePacePercentVsIdealLapChartData,
    savePacePercentChartData,
} from './ldata-chart-data-loader';

const MNT = './public/data/ldata-charts/';

beforeEach(() => {
    jest.clearAllMocks();
    (existsSync as jest.Mock).mockReturnValue(true);
    (readFileSync as jest.Mock).mockReturnValue('{"rows":[]}');
});

describe('startFinishChartData', () => {
    it('reads from the expected path', () => {
        getStartFinishChartData(1, 2, 3);
        expect(readFileSync).toHaveBeenCalledWith(
            `${MNT}startFinishChartData/1/2/3.json`,
            expect.any(Object)
        );
    });

    it('returns null on missing file', () => {
        (readFileSync as jest.Mock).mockImplementation(() => {
            throw new Error('ENOENT');
        });
        expect(getStartFinishChartData(1, 2, 3)).toBeNull();
    });

    it('writes to the expected path', () => {
        saveStartFinishChartData(1, 2, 3, { rows: [] } as any);
        expect(writeFileSync).toHaveBeenCalledWith(
            `${MNT}startFinishChartData/1/2/3.json`,
            '{"rows":[]}'
        );
    });
});

describe('cumulativeDeltaChartData', () => {
    it('reads from the expected path', () => {
        getCumulativeDeltaChartData(1, 2, 3);
        expect(readFileSync).toHaveBeenCalledWith(
            `${MNT}cumulativeDeltaChartData/1/2/3.json`,
            expect.any(Object)
        );
    });

    it('writes to the expected path', () => {
        saveCumulativeDeltaChartData(1, 2, 3, { rows: [] } as any);
        expect(writeFileSync).toHaveBeenCalledWith(
            `${MNT}cumulativeDeltaChartData/1/2/3.json`,
            '{"rows":[]}'
        );
    });
});

describe('write-only chart datasets', () => {
    it('saveCumulativeDeltaBestLapChartData writes to the right path', () => {
        saveCumulativeDeltaBestLapChartData(1, 2, 3, { rows: [] } as any);
        expect(writeFileSync).toHaveBeenCalledWith(
            `${MNT}cumulativeDeltaBestLapChartData/1/2/3.json`,
            '{"rows":[]}'
        );
    });

    it('savePacePercentVsIdealLapChartData writes to the right path', () => {
        savePacePercentVsIdealLapChartData(1, 2, 3, { rows: [] } as any);
        expect(writeFileSync).toHaveBeenCalledWith(
            `${MNT}pacePercentVsIdealLapChartData/1/2/3.json`,
            '{"rows":[]}'
        );
    });

    it('savePacePercentChartData writes to the right path', () => {
        savePacePercentChartData(1, 2, 3, { rows: [] } as any);
        expect(writeFileSync).toHaveBeenCalledWith(
            `${MNT}pacePercentChartData/1/2/3.json`,
            '{"rows":[]}'
        );
    });
});
