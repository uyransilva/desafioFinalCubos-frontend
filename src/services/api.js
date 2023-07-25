import axios from "axios";

// https://desafio-final-md05.herokuapp.com/
// "http://localhost:3000"
export default axios.create({
  baseURL: "https://desafio-final-md05.herokuapp.com/",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});



