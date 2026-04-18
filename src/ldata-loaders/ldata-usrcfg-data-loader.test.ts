jest.mock('fs');

import { readFileSync } from 'fs';
import { getActiveLeagueSchedule } from './ldata-usrcfg-data-loader';

beforeEach(() => {
    jest.clearAllMocks();
});

describe('getActiveLeagueSchedule', () => {
    it('reads and parses activeLeagueSchedule.json', () => {
        (readFileSync as jest.Mock).mockReturnValue('{"leagues":[]}');
        expect(getActiveLeagueSchedule()).toEqual({ leagues: [] });
        expect(readFileSync).toHaveBeenCalledWith(
            './public/data/ldata-usrcfg/activeLeagueSchedule.json',
            expect.any(Object)
        );
    });
});
