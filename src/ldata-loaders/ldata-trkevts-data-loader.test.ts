jest.mock('fs');
jest.mock('./kafka-notify', () => ({ notifyWrite: jest.fn() }));

import { readFileSync, writeFileSync, existsSync } from 'fs';
import {
    getRawPositionChanges,
    getOnTrackOvertakes,
    getOnTrackPitStops,
    getOnTrackIncidents,
    getOnTrackFinishingNotes,
    saveRawPositionChanges,
    saveOnTrackOvertakes,
    saveOnTrackPitStops,
    saveOnTrackIncidents,
    saveOnTrackFinishingNotes,
} from './ldata-trkevts-data-loader';

const MNT = './public/data/ldata-trkevts/';

beforeEach(() => {
    jest.clearAllMocks();
    (existsSync as jest.Mock).mockReturnValue(true);
    (readFileSync as jest.Mock).mockReturnValue('{"events":[]}');
});

const pairs: Array<{
    name: string;
    dataset: string;
    getter: Function;
    saver: Function;
}> = [
    {
        name: 'rawPositionChanges',
        dataset: 'rawPositionChanges',
        getter: getRawPositionChanges,
        saver: saveRawPositionChanges,
    },
    {
        name: 'onTrackOvertakes',
        dataset: 'onTrackOvertakes',
        getter: getOnTrackOvertakes,
        saver: saveOnTrackOvertakes,
    },
    {
        name: 'onTrackPitStops',
        dataset: 'onTrackPitStops',
        getter: getOnTrackPitStops,
        saver: saveOnTrackPitStops,
    },
    {
        name: 'onTrackIncidents',
        dataset: 'onTrackIncidents',
        getter: getOnTrackIncidents,
        saver: saveOnTrackIncidents,
    },
    {
        name: 'onTrackFinishingNotes',
        dataset: 'onTrackFinishingNotes',
        getter: getOnTrackFinishingNotes,
        saver: saveOnTrackFinishingNotes,
    },
];

describe.each(pairs)('trkevts $name', ({ dataset, getter, saver }) => {
    it('reads from the expected nested path', () => {
        getter(1, 2, 3);
        expect(readFileSync).toHaveBeenCalledWith(
            `${MNT}${dataset}/1/2/3.json`,
            expect.any(Object)
        );
    });

    it('returns null when the read fails', () => {
        (readFileSync as jest.Mock).mockImplementation(() => {
            throw new Error('ENOENT');
        });
        expect(getter(1, 2, 3)).toBeNull();
    });

    it('writes to the expected nested path', () => {
        saver(1, 2, 3, { events: [] });
        expect(writeFileSync).toHaveBeenCalledWith(
            `${MNT}${dataset}/1/2/3.json`,
            '{"events":[]}'
        );
    });
});
