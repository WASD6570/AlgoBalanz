import chai from "chai";
import chaiHttp from "chai-http";
import { client } from "../index";
import { expect, assert } from "chai";
import {
  calculateDollar,
  pairInstruments,
  Instrumento,
} from "../controllers/instruments";
import fs from "fs";
import type { cotizacionActual } from "../controllers/instruments/helpers";

function mockData() {
  const data = JSON.parse(fs.readFileSync("./mock.json", "utf8"));
  const arr = [];
  for (const key in data) {
    const instrumento = new Instrumento(key);
    Object.assign(instrumento, data[key]);
    arr.push(instrumento);
  }
  return pairInstruments(arr);
}

describe("Get data from ws", () => {
  it("should connect and receive data from the ws connection", (done) => {
    client.on("connect", (connection) => {
      connection.once("message", ({ utf8Data }) => {
        const data = JSON.parse(utf8Data);
        expect(data).to.be.a("object");
        expect(data.msg.securityID).to.be.a("string");
        expect(data.msg.last).to.be.a("object");
        expect(data.msg.last.price).to.be.a("number");
        done();
      });
    });
  });
});

describe("Pair instuments of the same settlementType", () => {
  it("should return an array of tuples, the position 0 is in ARS and position 1 is USD or EXT", (done) => {
    const paired = mockData();
    paired.forEach((item) => {
      expect(item[0]).to.be.a("object");
      expect(item[1]).to.be.a("object");
      expect(item[0].last.price).to.be.a("number");
      expect(item[1].last.price).to.be.a("number");
      assert.deepEqual(item[0].settlementType, item[1].settlementType);
    });
    done();
  });
});

describe("calculates the value of dollar MEP or dollar CABLE", () => {
  it("should return an array of object like cotizacionActual ", (done) => {
    const paired = mockData();
    const cotizaciones = paired.map((item) => {
      return calculateDollar(item[0], item[1]);
    });

    expect(cotizaciones).to.be.a("array");
    cotizaciones.forEach((item) => {
      expect(item.price).to.be.a("number");
      expect(item.instrumento).to.be.a("string");
      expect(item.settlementType).to.be.a("string");
    });

    done();
  });
});
