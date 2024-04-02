import axios from "axios";

const sendFileToServer = (form: FormData, endpoint: string, token: string) => {
  try {
    axios({
      method: "post",
      url: process.env.BE_BASEURL + endpoint,
      data: form,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }).catch((e) => {
      console.log(e);
    });
  } catch (e) {
    console.log(e);
  }
};

export default sendFileToServer;
