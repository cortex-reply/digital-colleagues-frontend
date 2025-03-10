// storage-adapter-import-placeholder
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Tools } from "./collections/Tools";
import { Agents } from "./collections/Agents";
import { Teams } from "./collections/Teams";
import { Toolspec } from "./collections/Toolspec";
import { Epics } from "./collections/Epics";
import { Tasks } from "./collections/Tasks";
import { Squads } from "./collections/Squads";
import { Projects } from "./collections/Projects";
import { Colleagues } from "./collections/Colleagues";
import { Functions } from "./collections/Functions";
import { KnowledgeBases } from "./collections/KnowledgeBases";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Tools,
    Agents,
    Teams,
    Toolspec,
    Epics,
    Tasks,
    Squads,
    Projects,
    Colleagues,
    Functions,
    KnowledgeBases,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || "",
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
});
