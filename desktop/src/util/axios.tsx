import axios from "axios";

export const client = axios.create({
    baseURL: "https://2yogy92kah.execute-api.us-west-2.amazonaws.com/prod/api",
    timeout: 10000
})