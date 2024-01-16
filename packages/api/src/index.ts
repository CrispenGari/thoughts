import "dotenv/config";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import ip from "ip";
import _ from "node-env-types";
import { createContext } from "./context";
export { type AppRouter } from "./routes/app.routes";
import { appRouter } from "./routes/app.routes";
import Fastify from "fastify";
import cors from "@fastify/cors";
import ws from "@fastify/websocket";
import { getFastifyPlugin } from "trpc-playground/handlers/fastify";
import process from "process";
import { sequelize } from "./sequelize";
import "./sequelize/relations";
import fastifyStatic from "@fastify/static";
import path from "path";
import multipart from "@fastify/multipart";
import { uploadRoute } from "./routes/upload/image.routes";

require("events").EventEmitter.prototype._maxListeners = 100;
process.setMaxListeners(100);

_();
const PORT: any = process.env.PORT || 3001;
const HOST =
  process.env.NODE_ENV === "production"
    ? "0.0.0.0"
    : "localhost" || "127.0.0.1";
const TPRC_API_ENDPOINT = "/api/trpc";
const TRPC_PLAYGROUND_ENDPOINT = "/api/trpc-playground";

(async () => {
  await sequelize.sync({ alter: true, force: false });
  const fastify = Fastify({
    logger: false,
    ignoreTrailingSlash: true,
    maxParamLength: 5000,
  });

  fastify.get("/", (_req, res) => {
    res.status(200).send("Hello ✌ from thoughts server.");
  });
  fastify.register(multipart, {
    limits: {
      fieldNameSize: 100, // Max field name size in bytes
      fieldSize: 100, // Max field value size in bytes
      fields: 10, // Max number of non-file fields
      fileSize: 1e7, // For multipart forms, the max file size in bytes
      files: 1, // Max number of file fields
      headerPairs: 2000, // Max number of header key=>value pairs
      parts: 1000, // For multipart forms, the max number of parts (fields + files)
    },
  });
  fastify.register(fastifyStatic, {
    root: path.resolve(path.join(__dirname.replace("src", ""), "storage")),
    prefixAvoidTrailingSlash: true,
    prefix: "/api/storage",
  });
  fastify.register(ws);
  fastify.register(cors, {
    credentials: true,
    origin: ["http://localhost:3000"],
  });

  fastify.register(fastifyTRPCPlugin, {
    prefix: TPRC_API_ENDPOINT,
    trpcOptions: { router: appRouter, createContext },
    useWSS: true,
  });
  fastify.register(
    await getFastifyPlugin({
      router: appRouter,
      trpcApiEndpoint: TPRC_API_ENDPOINT,
      playgroundEndpoint: TRPC_PLAYGROUND_ENDPOINT,
      request: {
        superjson: true,
      },
    }),
    { prefix: TRPC_PLAYGROUND_ENDPOINT }
  );
  fastify.register(uploadRoute, {
    prefix: "/api/upload/images",
  });

  fastify.listen({ port: PORT, host: HOST }, (error, _address) => {
    if (error) {
      console.error(error);
      process.exit(1);
    }
    console.log();
    console.log(`\t Local: http://127.0.0.1:${PORT}/`);
    console.log(`\t Network: http://${ip.address()}:${PORT}/`);
    console.log();
  });
})();
