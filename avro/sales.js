const avro = require("avsc");

const type = avro.Type.forSchema({
    name: 'SaleType',
    type: 'record',
    fields: [
        {
            name: 'sale_date',
            type: {
                type: 'long',
                logicalType: 'timestamp-millis'
            }
        },
        {
            name: 'unit_price',
            type: 'double'
        },
        {
            name: 'quantity',
            type: 'int'
        },
        {
            name: 'sold',
            type: 'int'
        },
        {
            name: 'remaining_quantity',
            type: 'int'
        },
        {
            name: 'product_id',
            type: 'string'
        },
        {
            name: 'store',
            type: 'string'
        }
    ]
});

module.exports = type;