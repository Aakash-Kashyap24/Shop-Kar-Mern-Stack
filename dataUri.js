import DataUriParser from "datauri/parser.js";
import Path from "path";

const getDataUri = (file) => {
  const parser = new DataUriParser();
  const fileName = path.extname(file.orginalName).toString();
  return parser.format(fileName, filt.content);
};

export default getDataUri;
