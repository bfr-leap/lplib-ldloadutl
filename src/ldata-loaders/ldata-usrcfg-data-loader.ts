import { readFileSync } from 'fs';

import type { ActiveLeagueSchedule } from 'ir-endpoints-types';

const MNT_PT = './public/data/ldata-usrcfg/';

export function getActiveLeagueSchedule(): ActiveLeagueSchedule {
    let ret: ActiveLeagueSchedule = <ActiveLeagueSchedule>JSON.parse(
        readFileSync(`${MNT_PT}activeLeagueSchedule.json`, {
            encoding: 'utf8',
            flag: 'r',
        })
    );

    return ret;
}
