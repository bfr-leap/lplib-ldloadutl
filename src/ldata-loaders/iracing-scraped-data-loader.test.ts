jest.mock('fs');

import { readFileSync } from 'fs';
import {
    getLeagueDirectory,
    getLeagueSeasons,
    getLeagueSeasonSessions,
    getLapChartData,
    getMembersData,
} from './iracing-scraped-data-loader';

const MNT = './public/data/ldata-irweb/';

beforeEach(() => {
    jest.clearAllMocks();
});

describe('getLeagueDirectory', () => {
    it('reads and parses leagueDirectory.json', () => {
        (readFileSync as jest.Mock).mockReturnValue('{"leagues":[]}');
        expect(getLeagueDirectory()).toEqual({ leagues: [] });
        expect(readFileSync).toHaveBeenCalledWith(
            `${MNT}leagueDirectory.json`,
            expect.any(Object)
        );
    });

    it('throws if the file is unreadable (no recovery)', () => {
        (readFileSync as jest.Mock).mockImplementation(() => {
            throw new Error('ENOENT');
        });
        expect(() => getLeagueDirectory()).toThrow('ENOENT');
    });
});

describe('getLeagueSeasons', () => {
    it('reads the per-league file', () => {
        (readFileSync as jest.Mock).mockReturnValue('{"seasons":[1,2]}');
        expect(getLeagueSeasons(42)).toEqual({ seasons: [1, 2] });
        expect(readFileSync).toHaveBeenCalledWith(
            `${MNT}leagueSeasons/42.json`,
            expect.any(Object)
        );
    });

    it('returns null on read failure', () => {
        (readFileSync as jest.Mock).mockImplementation(() => {
            throw new Error('ENOENT');
        });
        expect(getLeagueSeasons(42)).toBeNull();
    });
});

describe('getLeagueSeasonSessions', () => {
    it('reads the nested league/season file', () => {
        (readFileSync as jest.Mock).mockReturnValue('{"sessions":[]}');
        expect(getLeagueSeasonSessions(42, 7)).toEqual({ sessions: [] });
        expect(readFileSync).toHaveBeenCalledWith(
            `${MNT}leagueSeasonSessions/42/7.json`,
            expect.any(Object)
        );
    });

    it('returns null on read failure', () => {
        (readFileSync as jest.Mock).mockImplementation(() => {
            throw new Error('ENOENT');
        });
        expect(getLeagueSeasonSessions(42, 7)).toBeNull();
    });
});

describe('getLapChartData', () => {
    it('encodes negative simsession numbers with n prefix', () => {
        (readFileSync as jest.Mock).mockReturnValue('{"chunks":[]}');
        getLapChartData(123, -4);
        expect(readFileSync).toHaveBeenCalledWith(
            `${MNT}lapChartData/123/n4.json`,
            expect.any(Object)
        );
    });

    it('leaves non-negative simsession numbers as-is', () => {
        (readFileSync as jest.Mock).mockReturnValue('{"chunks":[]}');
        getLapChartData(123, 0);
        expect(readFileSync).toHaveBeenCalledWith(
            `${MNT}lapChartData/123/0.json`,
            expect.any(Object)
        );
    });
});

describe('getMembersData', () => {
    it('reads the nested league/season file', () => {
        (readFileSync as jest.Mock).mockReturnValue('{"members":[]}');
        expect(getMembersData(42, 7)).toEqual({ members: [] });
        expect(readFileSync).toHaveBeenCalledWith(
            `${MNT}membersData/42/7.json`,
            expect.any(Object)
        );
    });
});
