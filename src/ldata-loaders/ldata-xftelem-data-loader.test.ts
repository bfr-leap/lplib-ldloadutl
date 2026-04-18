jest.mock('fs');
jest.mock('./kafka-notify', () => ({ notifyWrite: jest.fn() }));

import { readFileSync, writeFileSync, existsSync } from 'fs';
import {
    getReconstructedTelemetry,
    writeReconstructedTelemetry,
} from './ldata-xftelem-data-loader';

const MNT = './public/data/ldata-xftelem/';

beforeEach(() => {
    jest.clearAllMocks();
    (existsSync as jest.Mock).mockReturnValue(true);
});

describe('getReconstructedTelemetry', () => {
    it('encodes negative simsession numbers with n prefix', () => {
        (readFileSync as jest.Mock).mockReturnValue('{}');
        getReconstructedTelemetry(1, 2, -3);
        expect(readFileSync).toHaveBeenCalledWith(
            `${MNT}reconstructedTelemetry/1/2/n3.json`,
            expect.any(Object)
        );
    });

    it('returns parsed content for existing files', () => {
        (readFileSync as jest.Mock).mockReturnValue('{"x":1}');
        expect(getReconstructedTelemetry(1, 2, 0)).toEqual({ x: 1 });
    });

    it('returns null on read failure', () => {
        (readFileSync as jest.Mock).mockImplementation(() => {
            throw new Error('ENOENT');
        });
        expect(getReconstructedTelemetry(1, 2, 0)).toBeNull();
    });
});

describe('writeReconstructedTelemetry', () => {
    it('writes under reconstructedTelemetry with the league/subsession/sim path', () => {
        writeReconstructedTelemetry(1, 2, 0, { epochs: [] } as any);
        expect(writeFileSync).toHaveBeenCalledWith(
            `${MNT}reconstructedTelemetry/1/2/0.json`,
            '{"epochs":[]}'
        );
    });
});
