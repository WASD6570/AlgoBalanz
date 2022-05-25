import fetch from "node-fetch";
import { calculateDollar, pairInstruments } from "./helpers";

export class Instrumento {
  securityID: string;

  constructor(securityID: string) {
    this.securityID = securityID;
  }
}

export const getFiles = async () => {
  const response = await fetch(
    "https://test-algobalanz.herokuapp.com/api/v1/prices"
  );
  return await response.json();
};

export const getAllFileNames = async () => {
  const response = await fetch(
    "https://test-algobalanz.herokuapp.com/api/v1/prices/security_id"
  );
  return await response.json();
};

export const getFile = async (fileName: string) => {
  const response = await fetch(
    `https://test-algobalanz.herokuapp.com/api/v1/prices/security_id/${fileName}`
  );
  return await response.json();
};

export { calculateDollar, pairInstruments };
