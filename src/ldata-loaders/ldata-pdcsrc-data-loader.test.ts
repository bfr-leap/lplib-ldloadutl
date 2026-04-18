jest.mock('fs');
jest.mock('./kafka-notify', () => ({ notifyWrite: jest.fn() }));

import { readFileSync, writeFileSync, existsSync } from 'fs';
import {
    getSimsessionPodcastScriptedSrc,
    saveSimsessionPodcastScriptedSrc,
} from './ldata-pdcsrc-data-loader';

const MNT = './public/data/ldata-pdcsrc/';

beforeEach(() => {
    jest.clearAllMocks();
    (existsSync as jest.Mock).mockReturnValue(true);
});

describe('simsessionPodcastScriptedSrc', () => {
    it('reads from the expected nested path', () => {
        (readFileSync as jest.Mock).mockReturnValue('{"script":"x"}');
        expect(getSimsessionPodcastScriptedSrc(111, 0)).toEqual({
            script: 'x',
        });
        expect(readFileSync).toHaveBeenCalledWith(
            `${MNT}simsessionPodcastScriptedSrc/111/0.json`,
            expect.any(Object)
        );
    });

    it('returns null on missing file', () => {
        (readFileSync as jest.Mock).mockImplementation(() => {
            throw new Error('ENOENT');
        });
        expect(getSimsessionPodcastScriptedSrc(111, 0)).toBeNull();
    });

    it('writes to the expected nested path', () => {
        saveSimsessionPodcastScriptedSrc(111, 0, { script: 'x' } as any);
        expect(writeFileSync).toHaveBeenCalledWith(
            `${MNT}simsessionPodcastScriptedSrc/111/0.json`,
            '{"script":"x"}'
        );
    });
});
