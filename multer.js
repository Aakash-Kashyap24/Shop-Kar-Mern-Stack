import multer from "multer";
import storage from multer.memoryStorage();

const singleUpload = multer({ storage }).single("file");
const multipleUpload = multer({ storage }).array("files", 5);

export { singleUpload, multipleUpload };
