import { Kafka, Producer } from 'kafkajs';

const BROKER = 'leap-relay1:9092';
const CLIENT_ID = 'lplib-ldloadutl';

let producer: Producer | null = null;
let initPromise: Promise<void> | null = null;
let disabled = false;

function init(): Promise<void> {
    if (initPromise) return initPromise;
    initPromise = (async () => {
        try {
            const kafka = new Kafka({
                clientId: CLIENT_ID,
                brokers: [BROKER],
            });
            const p = kafka.producer();
            await p.connect();
            producer = p;
        } catch (e) {
            disabled = true;
            console.log(
                'ldloadutl: Kafka not available, notifications disabled'
            );
        }
    })();
    return initPromise;
}

export function notifyWrite(
    topic: string,
    datasetName: string,
    keys: Record<string, number>
): void {
    if (disabled) return;

    const payload = {
        dataset: datasetName,
        ...keys,
        timestamp: Date.now(),
    };
    const messageKey = Object.values(keys).join(':');

    init()
        .then(() => {
            if (!producer) return;
            return producer.send({
                topic,
                messages: [
                    {
                        key: messageKey,
                        value: JSON.stringify(payload),
                    },
                ],
            });
        })
        .catch((e) => {
            console.log(
                `ldloadutl: Kafka send failed for topic ${topic}: ${
                    e?.message ?? e
                }`
            );
        });
}
