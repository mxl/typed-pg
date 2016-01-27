import { EventEmitter } from "events"
import { Writable, Readable } from "stream"

declare module pg {

  interface QueryCallback {
    (err: Error, result: ResultSet): void;
  }

  interface ClientConnectCallback {
    (err: Error, client: Client): void;
  }

  interface ConnectCallback {
    (err: Error, client: Client, done: Done): void;
  }

  interface Done {
    (): void;
  }

  interface ResultSet {
    rows: any[];
  }

  interface QueryConfig {
    name?: string;
    text: string;
    values?: any[];
  }

  interface Config {
    host?: string;
    user?: string;
    database?: string;
    password?: string;
    port?: number;
    rows?: number;
    binary?: boolean;
    poolSize?: number;
    poolIdleTimeout?: number;
    reapIntervalMillis?: number;
    poolLog?: boolean;
    client_encoding?: string;
    ssl?: boolean;
    application_name?: string;
    fallback_application_name?: string;
  }

  interface ResultBuilder {
    command: string;
    rowCount: number;
    oid: number;
    rows: any[];
    addRow(row: any): void;
  }

  export class Query extends EventEmitter {
    text: string;
    values: any[];

    on(event: "row", listener: (row: any, result: ResultBuilder) => void);
    on(event: "end", listener: (result: ResultBuilder) => void);
    on(event: "error", listener: (err: Error) => void);
    on(event: string, listener: Function);
  }

  export class Client extends EventEmitter {
    constructor(connString: string);
    constructor(config: Config);

    user: string;
    database: string;
    port: string;
    host: string;
    password: string;
    binary: boolean;
    encoding: string;
    ssl: boolean;

    query(query: QueryConfig, callback?: QueryCallback): Query;
    query(text: string, callback: QueryCallback): Query;
    query(text: string, values: any[], callback: QueryCallback): Query;

    connect(callback: ClientConnectCallback);
    end();

    pauseDrain(): void;
    resumeDrain(): void;

    on(event: "drain", listener: () => void);
    on(event: "error", listener: (err: Error) => void);
    on(event: "notification", listener: (message: any) => void);
    on(event: "notice", listener: (message: any) => void);
    on(event: string, listener: Function);
  }

  export function connect(connString: string, callback: ConnectCallback): void;
  export function end(): void;
  export function cancel(config: Config, client: Client, query: Query)
}

export = pg;
