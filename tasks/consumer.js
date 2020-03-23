const { Kafka } = require('kafkajs')
const Product = require("../models/product");

const kafka = new Kafka({
    clientId: 'retail-bff',
    brokers: [process.env.KAFKA_ZOOKEEPER_CONNECT]
});

const topic = 'store-shipment-swindon-001'
const consumer = kafka.consumer({ groupId: 'retail-swindon-001' })

const run = async () => {
    await consumer.connect()
    await consumer.subscribe({ topic })
    await consumer.run({
        // eachBatch: async ({ batch }) => {
        //   console.log(batch)
        // },
        eachMessage: async ({ topic, partition, message }) => {
            const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
            const payload = message.value
            console.log(`- ${prefix} ${message.key}#${payload}`)
            console.log(JSON.parse(payload).productId)


            Product.findById(JSON.parse(payload).productId)
                .exec((err, product) => {
                    if (err || !product) {
                        return res.status(400).json({
                            error: "Product not found"
                        });
                    }
                    console.log(product)
                    product.quantity = product.quantity + JSON.parse(payload).quantity
                    product.save((err, result) => {
                        if (err) {
                            return res.status(400).json({
                                error: errorHandler(err)
                            });
                        }
                    });

                });

        },
    })
}

run().catch(e => console.error(`[example/consumer] ${e.message}`, e))

const errorTypes = ['unhandledRejection', 'uncaughtException']
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

errorTypes.map(type => {
    process.on(type, async e => {
        try {
            console.log(`process.on ${type}`)
            console.error(e)
            await consumer.disconnect()
            process.exit(0)
        } catch (_) {
            process.exit(1)
        }
    })
})

signalTraps.map(type => {
    process.once(type, async () => {
        try {
            await consumer.disconnect()
        } finally {
            process.kill(process.pid, type)
        }
    })
})
