const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CloudName,
  api_key: process.env.APIKey,
  api_secret: process.env.APISecret,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "hieujoyce",
    format: async (req, file) => "png", // supports promises as well
  },
});
const parser = multer({ storage: storage });

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get("/", async (req, res) => {
  res.json({
    msg: "Hieu Joyce(Cỏ Dại) hello every body.",
    api: {
      getAllImage: {
        method: "GET",
        path: "/list",
      },
      deleteImage: {
        method: "GET",
        path: "/delete-image/{id}",
      },
      uploadImage: {
        method: "POST",
        path: "/upload",
        data: {
          image: "Chose your file image",
        },
      },
    },
  });
});
app.get("/list", async (req, res) => {
  try {
    let options = {
      resource_type: "image",
      type: "upload",
      prefix: "hieujoyce",
      max_results: 500,
    };
    const src = await cloudinary.api.resources(options);
    const data = src.resources.map((el) => {
      const obj = {
        url: el.url,
        id: el.public_id.substring(10, el.public_id.length),
      };
      return obj;
    });
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: error.error.message || "Lỗi server." });
  }
});

app.post("/upload", parser.single("image"), function (req, res) {
  res.json({ url: req.file.path });
});
app.get("/delete-image/:id", function (req, res) {
  cloudinary.uploader
    .destroy(`hieujoyce/${req.params.id}`)
    .then(() => {
      res.json({ msg: "Delete image success." });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});

app.listen(5000, async () => {
  console.log("Server is running on port 5000");
});
