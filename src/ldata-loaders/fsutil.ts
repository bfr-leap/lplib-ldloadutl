import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { notifyWrite } from './kafka-notify';

function mountPointToTopic(mountPoint: string): string {
    const parts = mountPoint.split('/').filter((p) => p.length > 0);
    return parts[parts.length - 1];
}

// export function ldataWriteFileOld(obj: any, name: string, mountPoint: string) {
//     name = name.replace(/-/g, 'n');
//     const ids = name.split('.')[0].split('_');
//     const path = `${mountPoint}${ids.slice(0, -1).join('/')}/`;
//     if (!existsSync(path)) {
//         mkdirSync(path, { recursive: true });
//     }
//     let newName = ids[ids.length - 1];
//     writeFileSync(`${path}${newName}.json`, JSON.stringify(obj));
// }

export function ldataWriteFile(
    obj: any,
    mountPoint: string,
    datasetName: string,
    keys: number[]
) {
    let keyStrings = keys.map((k) => (k < 0 ? `n${-k}` : `${k}`));
    const path = `${mountPoint}${datasetName}/${keyStrings
        .slice(0, -1)
        .join('/')}`;
    if (!existsSync(path)) {
        mkdirSync(path, { recursive: true });
    }
    const filePath = `${mountPoint}${datasetName}/${keyStrings.join('/')}.json`;
    writeFileSync(filePath, JSON.stringify(obj));

    const keyRecord: Record<string, number> = {};
    keys.forEach((k, i) => {
        keyRecord[`key${i}`] = k;
    });
    notifyWrite(mountPointToTopic(mountPoint), datasetName, keyRecord);
}

export function ldataReadFile<T>(
    mountPoint: string,
    datasetName: string,
    keys: number[]
): T | null {
    let keyStrings = keys.map((k) => (k < 0 ? `n${-k}` : `${k}`));
    try {
        let ret: T = JSON.parse(
            readFileSync(
                `${mountPoint}${datasetName}/${keyStrings.join('/')}.json`,
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
