interface RequestLog {
   method: string;
   statusCode: number;
   timestamp: number;
   endpoint: string;
   queryParameters: Record<string, string>;
   clientIp: string;
   userAgent: string;
}

interface ResponseLog {
   statusCode: number;
   responseTimeMs: number;
   timestamp: number;
}

interface Log {
   request: RequestLog;
   response: ResponseLog;
}

// Check if "logs" directory exists, if not create it
const logsDir = "./logs";
try {
   Deno.mkdirSync(logsDir);
} catch (err) {
   if (err instanceof Deno.errors.AlreadyExists) {
      // Directory already exists
   } else {
      throw err;
   }
}

const logs: Record<string, Log[]> = {};

// deno-lint-ignore no-explicit-any
export default async function requestLogger(ctx: any, next: any) {
   const start = Date.now();
   await next();
   const responseTime = Date.now() - start;

   const log: Log = {
      request: {
         method: ctx.request.method,
         statusCode: ctx.response.status,
         timestamp: start,
         endpoint: ctx.request.url.pathname,
         queryParameters: Object.fromEntries(ctx.request.url.searchParams.entries()),
         clientIp: ctx.request.ip,
         userAgent: ctx.request.headers.get("user-agent") || "",
      },
      response: {
         statusCode: ctx.response.status,
         responseTimeMs: responseTime,
         timestamp: Date.now(),
      },
   };

   const date = new Date().toISOString().split("T")[0];
   if (!logs[date]) logs[date] = [];
   logs[date].push(log);

   if (logs[date].length > 1000) {
      flushLogsToDisk();
      logs[date] = [];
   }
}

/**
 * Creates a log file for a specific date if it doesn't exist.
 * @param date The date for which to create the log file.
 */
function createDailyLogFileIfNotExists(date: string) {
   const logFilePath = `${logsDir}/requestLogs_${date}.json`;
   try {
      Deno.openSync(logFilePath, { write: true, createNew: true });
   } catch (err) {
      if (err instanceof Deno.errors.AlreadyExists) {
         // File already exists
      } else {
         throw err;
      }
   }
}

/**
 * Takes all logs from memory and writes them to a file on disk.
 * The file is named "requestLogs_<date>.json" and is stored in the "logs" directory.
 */
export function flushLogsToDisk() {
   for (const date in logs) {
      const logFilePath = `${logsDir}/requestLogs_${date}.json`;
      createDailyLogFileIfNotExists(date);
      // Append logs to file
      Deno.writeTextFile(logFilePath, `${JSON.stringify(logs[date])},\n`, { append: true });
   }
}