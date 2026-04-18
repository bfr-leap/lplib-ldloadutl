jest.mock('fs');
jest.mock('./kafka-notify', () => ({ notifyWrite: jest.fn() }));

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import {
    getStewardRulings,
    saveStewardRulings,
    getAllStewardRulings,
    getStewardRulingsByLeague,
    getStewardRulingsBySeason,
    getStewardRulingsByDriver,
} from './ldata-stward-data-loader';

const MNT = './public/data/ldata-stward/';
const ROOT = `${MNT}stewardRulings`;

interface Dirent {
    name: string;
    isDirectory: () => boolean;
    isFile: () => boolean;
}
const dir = (name: string): Dirent => ({
    name,
    isDirectory: () => true,
    isFile: () => false,
});
const file = (name: string): Dirent => ({
    name,
    isDirectory: () => false,
    isFile: () => true,
});

function ruling(overrides: Record<string, any> = {}) {
    return {
        ruling_id: 'discord-1',
        discord_user_id: '100',
        driver_id: '200',
        league_id: '42',
        season_id: '7',
        session_type: null,
        lap: null,
        classification: 'Minor',
        infraction: 'X',
        license_points: 1,
        sanctions: [],
        evidence_urls: [],
        ...overrides,
    };
}

beforeEach(() => {
    jest.clearAllMocks();
    (existsSync as jest.Mock).mockReturnValue(true);
});

describe('getStewardRulings', () => {
    it('reads and parses an existing (leagueId, seasonId) file', () => {
        (readFileSync as jest.Mock).mockReturnValue(JSON.stringify([ruling()]));
        expect(getStewardRulings(42, 7)).toHaveLength(1);
    });

    it('returns an empty array when no file exists', () => {
        (readFileSync as jest.Mock).mockImplementation(() => {
            throw new Error('ENOENT');
        });
        expect(getStewardRulings(42, 7)).toEqual([]);
    });
});

describe('saveStewardRulings', () => {
    it('writes the rulings array as JSON to the expected path', () => {
        const rulings = [ruling()];
        saveStewardRulings(42, 7, rulings as any);
        expect(writeFileSync).toHaveBeenCalledWith(
            `${ROOT}/42/7.json`,
            JSON.stringify(rulings)
        );
    });

    it('encodes negative leagueIds with n prefix', () => {
        saveStewardRulings(-3, 7, [] as any);
        expect(writeFileSync).toHaveBeenCalledWith(`${ROOT}/n3/7.json`, '[]');
    });
});

describe('getAllStewardRulings', () => {
    it('returns [] when the root directory does not exist', () => {
        (existsSync as jest.Mock).mockReturnValue(false);
        expect(getAllStewardRulings()).toEqual([]);
    });

    it('walks leagues and seasons, skipping bad segments', () => {
        (readdirSync as jest.Mock).mockImplementation((path: string) => {
            if (path === ROOT) {
                return [
                    dir('42'),
                    dir('n3'),
                    dir('readme'), // non-numeric: skipped
                    file('stray.json'), // non-directory: skipped
                ];
            }
            if (path === `${ROOT}/42`) {
                return [
                    file('7.json'),
                    file('not-a-number.json'), // skipped
                    file('8.txt'), // skipped (not .json)
                    dir('9'), // non-file: skipped
                ];
            }
            if (path === `${ROOT}/n3`) {
                return [file('11.json')];
            }
            return [];
        });
        (readFileSync as jest.Mock).mockImplementation((path: string) => {
            if (path === `${ROOT}/42/7.json`) {
                return JSON.stringify([ruling({ ruling_id: 'a' })]);
            }
            if (path === `${ROOT}/n3/11.json`) {
                return JSON.stringify([ruling({ ruling_id: 'b' })]);
            }
            throw new Error('ENOENT');
        });

        const result = getAllStewardRulings();
        expect(result.map((r) => r.ruling_id).sort()).toEqual(['a', 'b']);
    });
});

describe('getStewardRulingsByLeague', () => {
    it('returns [] when the league directory does not exist', () => {
        (existsSync as jest.Mock).mockImplementation(
            (p: string) => p !== `${ROOT}/42`
        );
        expect(getStewardRulingsByLeague(42)).toEqual([]);
    });

    it('aggregates every season file for the given league', () => {
        (readdirSync as jest.Mock).mockImplementation((path: string) => {
            if (path === `${ROOT}/42`) {
                return [file('7.json'), file('8.json')];
            }
            return [];
        });
        (readFileSync as jest.Mock).mockImplementation((path: string) => {
            if (path === `${ROOT}/42/7.json`) {
                return JSON.stringify([ruling({ ruling_id: 'a' })]);
            }
            if (path === `${ROOT}/42/8.json`) {
                return JSON.stringify([
                    ruling({ ruling_id: 'b' }),
                    ruling({ ruling_id: 'c' }),
                ]);
            }
            throw new Error('ENOENT');
        });
        expect(getStewardRulingsByLeague(42).map((r) => r.ruling_id)).toEqual([
            'a',
            'b',
            'c',
        ]);
    });
});

describe('getStewardRulingsBySeason', () => {
    beforeEach(() => {
        (readdirSync as jest.Mock).mockImplementation((path: string) => {
            if (path === ROOT) return [dir('42')];
            if (path === `${ROOT}/42`) {
                return [file('7.json'), file('8.json')];
            }
            return [];
        });
        (readFileSync as jest.Mock).mockImplementation((path: string) => {
            if (path === `${ROOT}/42/7.json`) {
                return JSON.stringify([
                    ruling({ ruling_id: 'a', season_id: '7' }),
                ]);
            }
            if (path === `${ROOT}/42/8.json`) {
                return JSON.stringify([
                    ruling({ ruling_id: 'b', season_id: '8' }),
                ]);
            }
            throw new Error('ENOENT');
        });
    });

    it('filters by season_id, comparing as strings', () => {
        // season_id on the ruling is string; the function arg is number.
        // The fix added after updating ir-endpoints-types ensures both are
        // coerced to string before comparing.
        expect(getStewardRulingsBySeason(7).map((r) => r.ruling_id)).toEqual([
            'a',
        ]);
        expect(getStewardRulingsBySeason(8).map((r) => r.ruling_id)).toEqual([
            'b',
        ]);
        expect(getStewardRulingsBySeason(999)).toEqual([]);
    });
});

describe('getStewardRulingsByDriver', () => {
    beforeEach(() => {
        (readdirSync as jest.Mock).mockImplementation((path: string) => {
            if (path === ROOT) return [dir('42')];
            if (path === `${ROOT}/42`) return [file('7.json')];
            return [];
        });
        (readFileSync as jest.Mock).mockReturnValue(
            JSON.stringify([
                ruling({ ruling_id: 'by-driver', driver_id: '555' }),
                ruling({
                    ruling_id: 'by-discord',
                    driver_id: null,
                    discord_user_id: '999',
                }),
                ruling({ ruling_id: 'unrelated', driver_id: '111' }),
            ])
        );
    });

    it('matches on driver_id', () => {
        expect(getStewardRulingsByDriver(555).map((r) => r.ruling_id)).toEqual([
            'by-driver',
        ]);
    });

    it('matches on discord_user_id when driver_id is null', () => {
        expect(
            getStewardRulingsByDriver('999').map((r) => r.ruling_id)
        ).toEqual(['by-discord']);
    });

    it('returns [] when no ruling matches', () => {
        expect(getStewardRulingsByDriver(42)).toEqual([]);
    });
});
