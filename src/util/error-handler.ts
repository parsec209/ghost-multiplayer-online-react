import axios from "axios";

const handleError = (err: unknown): string => {
  //console.log(err);
  let message: string = "";

  if (axios.isAxiosError(err)) {
    if (err.response) {
      message = err.response.data.message || err.response.data;
    } else if (err.request) {
      message = JSON.stringify(err.request);
    } else {
      message = err.message;
    }
  } else if (err instanceof Error) {
    message = err.message;
  } else {
    message = "Unknown error";
  }

  return message;
};

export default handleError;
