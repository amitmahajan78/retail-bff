import { KafkaClient as Client, Consumer, Message, Offset, OffsetFetchRequest, ConsumerOptions } from 'kafka-node';

const kafkaHost = process.env.KAFKA_ZOOKEEPER_CONNECT;

exports.kafkaSubscribe = (topic) => {
    const client = new Client({ kafkaHost });
    const topics = new OffsetFetchRequest[{ topic: topic, partition: 0 }];
    const options = new ConsumerOptions({ autoCommit: false, fetchMaxWaitMs: 1000, fetchMaxBytes: 1024 * 1024 });

    const consumer = new Consumer(client, topics, options);

    consumer.on('error', function (err) {
        console.log('error', err);
    });

    client.refreshMetadata(
        [topic],
        (err) => {
            const offset = new Offset(client);

            if (err) {
                throw err;
            }

            consumer.on('message', function (message) {
                // do something useful with message
            });

            /*
             * If consumer get `offsetOutOfRange` event, fetch data from the smallest(oldest) offset
             */
            consumer.on(
                'offsetOutOfRange',
                (topic) => {
                    offset.fetch([topic], function (err, offsets) {
                        if (err) {
                            return console.error(err);
                        }
                        const min = Math.min.apply(null, offsets[topic.topic][topic.partition]);
                        consumer.setOffset(topic.topic, topic.partition, min);
                    });
                }
            );
        }
    );
}