import express from "express";
import { creatTable, fetchAllTableInSingleDatabase, fetchSingleTableData, getAllDatabases, } from "../controller/main_controller";
const router = express.Router();

router.post("/create-table",creatTable)
router.get("/get-all-databases",getAllDatabases)
router.get("/database/:database/tables",fetchAllTableInSingleDatabase)
router.get("/fetchSingleTableData",fetchSingleTableData)

export default router;