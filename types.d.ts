import { promises } from "dns";
import {Connection, connection} from "mongoose";

declare global{
    var mongoose : {
        conn : Connection | null ;
        promise : promise<Connection> |null;
    };
}

export {} ;