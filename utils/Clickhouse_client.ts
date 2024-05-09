import { createClient } from "@clickhouse/client";

export async function initClickHouseClient(){
    const client = createClient({
        url: 'https://clickhouse.dznew.datazip.io',
        username: 'deep_shah',
        password: 'deep_shah_xSzvZB6r1z_WxGto7uierpSK',
    })
    const rows = await client.query({
        query: 'SELECT 1',
        format: 'JSONEachRow',
    })
    console.log('Result: ', await rows.json())
    return client
}