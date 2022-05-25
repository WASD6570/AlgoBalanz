import ws from "websocket";
import {
  calculateDollar,
  pairInstruments,
  Instrumento,
  getAllFileNames,
} from "./controllers/instruments";

const WebSocketClient = ws.client;
let client = new WebSocketClient();

let ready = {};

client.on("connectFailed", function (error) {
  console.log("Connect Error: " + error.toString());
});

client.on("connect", async function (connection) {
  const { response } = await getAllFileNames();

  const arrOfInstrumentos: Array<Instrumento> = response.map((item: any) => {
    return new Instrumento(item);
  });

  console.log("WebSocket Client Connected");

  connection.on("error", function (error) {
    console.log("Connection Error: " + error.toString());
  });

  connection.on("close", function () {
    console.log("echo-protocol Connection Closed");
  });

  connection.on("message", ({ utf8Data }) => {
    const data = JSON.parse(utf8Data);

    arrOfInstrumentos.forEach((item: Instrumento) => {
      if (item.securityID === data.msg.securityID) {
        Object.assign(item, data.msg);
      }
    });

    const paired = pairInstruments(arrOfInstrumentos);

    const cotizacionActual = paired.map((item) => {
      return calculateDollar(item[0], item[1]);
    });

    ready = cotizacionActual.filter((i) => i);
  });
});

client.connect("wss://test-algobalanz.herokuapp.com/ws/holi");

// setInterval(() => {
//   console.log(ready);
// }, 1000);

export { client }; //for testing
