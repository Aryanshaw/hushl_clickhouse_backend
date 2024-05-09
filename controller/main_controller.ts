import { getClient } from "../index";

let clickhouseClient:any;
type Data = { number: string }

export const creatTable = async(req:any, res:any)=>{
    try{
      const {tableName} = req.body
      clickhouseClient = await getClient()

      const query = `CREATE TABLE IF NOT EXISTS ${tableName}
      (id UInt64, 
       name String, 
       create_Date Date,
       salary Float64)
      ORDER BY (id)`;

      await clickhouseClient.command({
        query: query,
        clickhouse_settings: {
          wait_end_of_query: 1,
        },
      })

      console.log('Table created successfully');
      res.status(200).json({ message: 'Table created successfully' });
                   
    }catch(error){
      console.error('Error creating table:', error);
      res.status(500).json({ error: 'Error creating table' });
    }
}

export const getAllDatabases= async(req:any , res:any) => {
  try{
    clickhouseClient = await getClient()
    
    const databasesQuery = 'SHOW DATABASES';
    const databasesResult = await clickhouseClient.query({query:databasesQuery});

    // Read the data from the stream
    let data = '';
    databasesResult._stream.on('data', (chunk:any) => {
      data += chunk.toString();
    });

    databasesResult._stream.on('end', () => {
      const result = JSON.parse(data);
      res.status(200).json({ databases :result?.data });
    });
  }catch(error){
      console.error('Error fetching databases:', error);
      res.status(500).json({ error: 'Error fetching databases' });
  }
}

export const fetchAllTableInSingleDatabase = async(req:any,res:any)=>{
  try {
    const { database } = req.params;
    clickhouseClient = await getClient()
    // Query to fetch all tables in the specified database
    const query = `SELECT name FROM system.tables WHERE database = '${database}'`;

    const result = await clickhouseClient.query({
      query:query,
      format: 'JSONEachRow'
    });
    const tempResult = await result.json()
    console.log(tempResult,"tables")
    const tables = tempResult.map((row:any) => row.name);

    res.json({ tables:tables });
  } catch (error) {
    console.error('Error fetching tables:', error);
    res.status(500).json({ error: 'Error fetching tables' });
  }
}

export const fetchSingleTableData = async(req:any,res:any) => {
  try{
    const {database,tableName} = req.query
    clickhouseClient = await getClient()

    const query = `SELECT * FROM ${database}.${tableName} LIMIT 50`;

    const rows:any = await clickhouseClient.query({
      query: query,
      format: 'JSON',
    })
    // console.log(rows)
    const result = await rows.json()
    res.status(200).json({ table_Data :result?.data });

  }catch(error){
    console.error('Error fetching tables:', error);
    res.status(500).json({ error: 'Error fetching table data' });
  }
}