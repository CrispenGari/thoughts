import {
  FastifyInstance,
  FastifyServerOptions,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import path from "path";
import util from "util";
import stream from "stream";
import fs from "fs";
import { v4 } from "uuid";

const storagePath = path.resolve(
  path.join(__dirname.replace(`\\src\\routes\\upload`, ""), "storage", "images")
);
const pump = util.promisify(stream.pipeline);

export const uploadRoute = async (
  fastify: FastifyInstance,
  _options: FastifyServerOptions
) => {
  fastify.post("/", async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const data = await req.file();
      if (data) {
        const imageName = v4().concat(".jpg");
        const savePath = path.resolve(path.join(storagePath, imageName));
        await pump(data.file, fs.createWriteStream(savePath));
        return res
          .code(500)
          .send({ success: true, image: `/api/storage/images/${imageName}` });
      } else {
        return res.code(500).send({ success: false });
      }
    } catch (error) {
      return res.code(500).send({ success: false });
    }
  });
};
