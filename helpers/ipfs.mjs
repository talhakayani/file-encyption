import { create } from "ipfs-http-client";

const ipfsClient = create(new URL("http://46.101.133.110:5001"));

const readFileFromIPFS = async (cid) => {
  const stream = await ipfsClient.cat(cid);

  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  const content = Buffer.concat(chunks);

  const decodedContent = new TextDecoder().decode(content);
  return decodedContent;
};

export { readFileFromIPFS };
