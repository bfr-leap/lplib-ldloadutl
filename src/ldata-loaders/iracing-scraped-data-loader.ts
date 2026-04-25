/**
 *
 * This code defines a set of functions for reading and parsing JSON data from files. These functions are
 * designed to fetch various types of iRacing league-related data, such as league directories, seasons,
 * sessions, lap chart data, members' information, and telemetry data from files stored in a specified
 * directory. The code uses the 'fs' module to read JSON files and returns the parsed data corresponding
 * to the provided input parameters.
 *
 */

import { readFileSync } from 'fs';
import { readFile } from 'fs/promises';

import type {
    LeagueDirectory,
    LeagueSeasons,
    LeagueSeasonSessions,
    LapChartData,
    MembersData,
    SubsessionTelemetry,
} from 'ir-endpoints-types';

const MNT_PT = './public/data/ldata-irweb/';

export function getLeagueDirectory(): LeagueDirectory {
    let ret: LeagueDirectory = <LeagueDirectory>JSON.parse(
        readFileSync(`${MNT_PT}leagueDirectory.json`, {
            encoding: 'utf8',
            flag: 'r',
        })
    );

    return ret;
}

export async function getLeagueDirectoryAsync(): Promise<LeagueDirectory> {
    let ret: LeagueDirectory = <LeagueDirectory>JSON.parse(
        await readFile(`${MNT_PT}leagueDirectory.json`, {
            encoding: 'utf8',
            flag: 'r',
        })
    );

    return ret;
}

export function getLeagueSeasons(leagueId: number): LeagueSeasons | null {
    try {
        let ret: LeagueSeasons = <LeagueSeasons>JSON.parse(
            readFileSync(`${MNT_PT}leagueSeasons/${leagueId}.json`, {
                encoding: 'utf8',
                flag: 'r',
            })
        );

        return ret;
    } catch (e) {
        return null;
    }
}

export async function getLeagueSeasonsAsync(
    leagueId: number
): Promise<LeagueSeasons | null> {
    try {
        let ret: LeagueSeasons = <LeagueSeasons>JSON.parse(
            await readFile(`${MNT_PT}leagueSeasons/${leagueId}.json`, {
                encoding: 'utf8',
                flag: 'r',
            })
        );

        return ret;
    } catch (e) {
        return null;
    }
}

export function getLeagueSeasonSessions(
    leagueId: number,
    seasonId: number
): LeagueSeasonSessions | null {
    try {
        let ret: LeagueSeasonSessions = <LeagueSeasonSessions>JSON.parse(
            readFileSync(
                `${MNT_PT}leagueSeasonSessions/${leagueId}/${seasonId}.json`,
                {
                    encoding: 'utf8',
                    flag: 'r',
                }
            )
        );

        return ret;
    } catch (e) {
        return null;
    }
}

export async function getLeagueSeasonSessionsAsync(
    leagueId: number,
    seasonId: number
): Promise<LeagueSeasonSessions | null> {
    try {
        let ret: LeagueSeasonSessions = <LeagueSeasonSessions>JSON.parse(
            await readFile(
                `${MNT_PT}leagueSeasonSessions/${leagueId}/${seasonId}.json`,
                {
                    encoding: 'utf8',
                    flag: 'r',
                }
            )
        );

        return ret;
    } catch (e) {
        return null;
    }
}

export function getLapChartData(
    subsessionId: number,
    simsessionNumber: number
): LapChartData {
    let simsessionStr =
        simsessionNumber < 0 ? `n${-simsessionNumber}` : `${simsessionNumber}`;
    let ret: LapChartData = <LapChartData>JSON.parse(
        readFileSync(
            `${MNT_PT}lapChartData/${subsessionId}/${simsessionStr}.json`,
            {
                encoding: 'utf8',
                flag: 'r',
            }
        )
    );

    return ret;
}

export async function getLapChartDataAsync(
    subsessionId: number,
    simsessionNumber: number
): Promise<LapChartData> {
    let simsessionStr =
        simsessionNumber < 0 ? `n${-simsessionNumber}` : `${simsessionNumber}`;
    let ret: LapChartData = <LapChartData>JSON.parse(
        await readFile(
            `${MNT_PT}lapChartData/${subsessionId}/${simsessionStr}.json`,
            {
                encoding: 'utf8',
                flag: 'r',
            }
        )
    );

    return ret;
}

export function getMembersData(
    leagueId: number,
    seasonId: number
): MembersData {
    let ret: MembersData = <MembersData>JSON.parse(
        readFileSync(`${MNT_PT}membersData/${leagueId}/${seasonId}.json`, {
            encoding: 'utf8',
            flag: 'r',
        })
    );

    return ret;
}

export async function getMembersDataAsync(
    leagueId: number,
    seasonId: number
): Promise<MembersData> {
    let ret: MembersData = <MembersData>JSON.parse(
        await readFile(`${MNT_PT}membersData/${leagueId}/${seasonId}.json`, {
            encoding: 'utf8',
            flag: 'r',
        })
    );

    return ret;
}
