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
import { Toolspecs } from "./collections/Toolspecs";
import { Epics } from "./collections/Epics";
import { Tasks } from "./collections/Tasks";
import { Squads } from "./collections/Squads";
import { Projects } from "./collections/Projects";
import { Colleagues } from "./collections/Colleagues";
import { Functions } from "./collections/Functions";
import { KnowledgeBases } from "./collections/KnowledgeBases";
import { websocket } from "./services";

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
    Toolspecs,
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
  onInit: (payload) => {
    console.log("initializing");

    websocket.initialize(
      { cors: { origin: "*" } }, // Adjust CORS for production
      process.env.WEBSOCKET_PORT ? parseInt(process.env.WEBSOCKET_PORT) : 3001
    );

    console.log("onInit end:", Date.now());
  },
  plugins: [
    payloadCloudPlugin(),
    // websocketServerPlugin({
    //   collections: ["tasks"],
    //   port: 3001,
    // }),
    // storage-adapter-placeholder
  ],
});
