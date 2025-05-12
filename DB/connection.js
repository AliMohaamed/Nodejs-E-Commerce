import mongoose from "mongoose";

export const connectionDB = async () => {
  return await mongoose
    .connect(process.env.CONNECTIONURL)
    .then(() => console.log("DB Connected....!"))
    .catch((error) => console.log("Error", error));
};
