import express from 'express';
import dotenv from "dotenv";
import { createClient } from '@clickhouse/client'
import cors from "cors"
import main_router from "./routes/main_router"
import { initClickHouseClient } from './utils/Clickhouse_client';

const app = express();
dotenv.config()

app.use(express.json());
app.use(cors());
app.use("/api",main_router)

let client:any;
export const getClient = () => {
  return client;
};


const PORT = process.env.PORT || 3000;
app.listen(PORT, async() => {
    if(!client){
       client = await initClickHouseClient()
    }
    console.log(`http://localhost:${PORT}`);
});
