jest.mock('fs');
jest.mock('./kafka-notify', () => ({ notifyWrite: jest.fn() }));

import { readFileSync, writeFileSync, existsSync } from 'fs';
import {
    getSimSessionResults,
    getLeaguSubsessionIndex,
    getSimsessionDriverTelemetry,
    getProcessedTelemetryManifest,
    saveProcessedTelemetryManifest,
} from './iracing-derived-data-loader';

const MNT = './public/data/ldata-rsltsts/';

beforeEach(() => {
    jest.clearAllMocks();
    (existsSync as jest.Mock).mockReturnValue(true);
});

describe('getSimSessionResults', () => {
    it('encodes negative simsession numbers with n prefix', () => {
        (readFileSync as jest.Mock).mockReturnValue('{"entries":[]}');
        getSimSessionResults(9999, -1);
        expect(readFileSync).toHaveBeenCalledWith(
            `${MNT}simSessionResults/9999/n1.json`,
            expect.any(Object)
        );
    });

    it('uses raw simsession numbers when non-negative', () => {
        (readFileSync as jest.Mock).mockReturnValue('{"entries":[]}');
        expect(getSimSessionResults(9999, 2)).toEqual({ entries: [] });
        expect(readFileSync).toHaveBeenCalledWith(
            `${MNT}simSessionResults/9999/2.json`,
            expect.any(Object)
        );
    });
});

describe('getLeaguSubsessionIndex', () => {
    it('reads the per-league simsession index', () => {
        (readFileSync as jest.Mock).mockReturnValue('[]');
        expect(getLeaguSubsessionIndex(42)).toEqual([]);
        expect(readFileSync).toHaveBeenCalledWith(
            `${MNT}leagueSimsessionIndex/42.json`,
            expect.any(Object)
        );
    });
});

describe('getSimsessionDriverTelemetry', () => {
    it('encodes negative simsession numbers in the nested path', () => {
        (readFileSync as jest.Mock).mockReturnValue('{}');
        getSimsessionDriverTelemetry(111, -2, 333);
        expect(readFileSync).toHaveBeenCalledWith(
            `${MNT}simsessionDriverTelemetry/111/n2/333.json`,
            expect.any(Object)
        );
    });

    it('leaves non-negative simsession numbers as-is', () => {
        (readFileSync as jest.Mock).mockReturnValue('{}');
        getSimsessionDriverTelemetry(111, 2, 333);
        expect(readFileSync).toHaveBeenCalledWith(
            `${MNT}simsessionDriverTelemetry/111/2/333.json`,
            expect.any(Object)
        );
    });
});

describe('processed telemetry manifest', () => {
    it('returns an empty Set when no manifest file exists', () => {
        (readFileSync as jest.Mock).mockImplementation(() => {
            throw new Error('ENOENT');
        });
        const result = getProcessedTelemetryManifest(42);
        expect(result).toBeInstanceOf(Set);
        expect(result.size).toBe(0);
    });

    it('returns a Set of subsession ids from the manifest', () => {
        (readFileSync as jest.Mock).mockReturnValue('[10, 20, 30]');
        const result = getProcessedTelemetryManifest(42);
        expect(result).toEqual(new Set([10, 20, 30]));
    });

    it('persists the Set as a JSON array at the expected path', () => {
        saveProcessedTelemetryManifest(42, new Set([10, 20, 30]));
        expect(writeFileSync).toHaveBeenCalledWith(
            `${MNT}processedTelemetryManifest/42.json`,
            '[10,20,30]'
        );
    });
});
