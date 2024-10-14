import { join, dirname, fromFileUrl } from "https://deno.land/std@0.224.0/path/mod.ts";

class JsonFilePersistence<T> {
   private filePath: string;

   constructor(fileName: string) {
      // Resolve the file path in Deno
      this.filePath = join(dirname(fromFileUrl(import.meta.url)), fileName);

      // Create the file if it doesn't exist (recursively creates directories)
      Deno.mkdirSync(dirname(this.filePath), { recursive: true });
   }

   async save(data: T): Promise<void> {
      const jsonData = JSON.stringify(data, null, 2);
      await Deno.writeTextFile(this.filePath, jsonData);
   }

   async read(): Promise<T | null> {
      try {
         const fileContent = await Deno.readTextFile(this.filePath);
         return JSON.parse(fileContent) as T;
      } catch (err) {
         if (err instanceof Deno.errors.NotFound) {
            return null;  // File doesn't exist
         }
         throw err;  // Re-throw other errors
      }
   }
}

export default JsonFilePersistence;
