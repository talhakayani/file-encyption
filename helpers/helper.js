const request = require("request");
const axios = require("axios");
const FormData = require("form-data");
const hbs = require("nodemailer-express-handlebars");
const nodemailer = require("nodemailer");
const path = require("path");
const AWS = require("aws-sdk");
const fs = require("fs");
// Create an S3 client
var ep = new AWS.Endpoint(process.env.AWS_S3_URL);

const s3 = new AWS.S3({
  endpoint: ep,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3ForcePathStyle: true,
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

// point to the template folder
const handlebarOptions = {
  viewEngine: {
    partialsDir: path.resolve("./emailtemplates/"),
    defaultLayout: false,
  },
  viewPath: path.resolve("./emailtemplates/"),
};

// use a template file with nodemailer
transporter.use("compile", hbs(handlebarOptions));

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = {
  metaplexConfirm: async (network, tx) => {
    let confirmedTx = null;
    for (let tries = 0; tries < MAX_RETRIES; tries++) {
      confirmedTx = await new metaplex.Connection(
        network,
        "finalized"
      ).getTransaction(tx);
      if (confirmedTx) break;
      await sleep(1000);
    }
    if (!confirmedTx) throw new Error("Could not find requested transaction");
  },
  fetchIPFSData: async (uri) => {
    let res = await axios({
      method: "get",
      url: uri,
    });
    let respnseData = res.data;

    return respnseData;
  },
  fetchAllNft: async (walletAddress, userId) => {
    const connection = new Connection(endpoint?.url);
    const ownerPublickey = walletAddress; //"DXww9qbSPSL3vGBMhKPuRTmACZQLGWKyipq3o8rKjdLu";
    const nftsmetadata = await Metadata.findDataByOwner(
      connection,
      ownerPublickey
    );
    nftsmetadata.forEach(async function (value, index) {
      const data = await database.nft.getNftByMint(value.mint);
      if (!data) {
        const options = {
          method: "GET",
          url: value.data.uri, // "https://arweave.net/7LR9UU0dVCTSIDv2EOBPk8U0thaxyUWq1alAaSSgNAY",
          headers: {},
        };
        request(options, async function (error, response) {
          if (response !== undefined) {
            const res = response.body;
            if (res) {
              const resData = JSON.parse(res);
              if (resData) {
                const nftObject = {
                  userId: userId,
                  blockchainType: "Solana",
                  mint: value.mint ?? null,
                  assetUrl: value.data.uri ?? null,
                  key: value.key ?? null,
                  name: resData.name ?? null,
                  artistName: resData.artistName ?? null,
                  symbol: resData.symbol ?? null,
                  description: resData.description ?? null,
                  seller_fee_basis_points:
                    resData.seller_fee_basis_points ?? null,
                  image: resData.image ?? null,
                  external_url: resData.external_url ?? null,
                  properties: resData.properties
                    ? JSON.stringify(resData.properties)
                    : null,
                  creators: value.data.creators
                    ? JSON.stringify(value.data.creators)
                    : null,
                  primarySaleHappened: value.primarySaleHappened ?? null,
                  isMutable: value.isMutable ?? null,
                  editionNonce: value.editionNonce ?? null,
                  tokenStandard: value.tokenStandard ?? null,
                };
                if (resData.collection && resData.collection.id) {
                  nftObject.collectionId = resData.collection.id;
                }
                await database.nft.addNft(nftObject);
              }
            }
          }
        });
      }
    });
    return true;
  },
  uploadFileToIpfs: async (filename) => {
    try {
      let data = new FormData();
      const file = fs.createReadStream(filename);
      data.append("file", file);
      const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
      const response = await axios.post(url, data, {
        maxBodyLength: Infinity,
        maxContentLength: Infinity,

        headers: {
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
          pinata_api_key: `${process.env.PINATA_API_KEY}`,
          pinata_secret_api_key: `${process.env.PINATA_API_SECRET}`,
        },
      });
      const res = response.data;
      if (res) {
        file.close();
      }
      return res;
    } catch (err) {
      console.log("🚀 ~ Error in uploading image on ipfs", err);
      return err;
    }
  },
  uploadJSONToIpfs: async (data) => {
    try {
      const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
      const response = await axios.post(url, data, {
        headers: {
          pinata_api_key: `${process.env.PINATA_API_KEY}`,
          pinata_secret_api_key: `${process.env.PINATA_API_SECRET}`,
        },
      });
      return response.data;
    } catch (err) {
      console.log("Error in uploading JSON to ipfs", err);
      return err;
    }
  },
  uploadFileToS3: async (filename) => {
    try {
      const fileStream = fs.createReadStream(filename);
      const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Body: fileStream,
        Key: filename,
      };
      const response = await s3.upload(uploadParams).promise();

      if (response) {
        fileStream.close();
      }
      return response;
    } catch (err) {
      console.log("🚀 ~ Error in uploading on s3 bucket===>", err);
      return err;
    }
  },
  sendEmail: async (data, template) => {
    const mailOptions = {
      from: data?.email,
      to: process.env.SMTP_TO_EMAIL,
      subject: data?.subject,
      template: template,
      context: data,
      // attachments: [{ filename: "pic-1.jpeg", path: "./attachments/pic-1.jpeg" }],
    };
    // trigger the sending of the E-mail
    return await transporter.sendMail(mailOptions);
  },
};
