import { Instrumento } from "../index";

export type cotizacionActual = {
  instrumento: string;
  settlementType: "CI" | "24hs" | "48hs";
  price: number;
};

export function calculateDollar(
  ars: any = {},
  comp: any = {}
): cotizacionActual {
  if (ars.settlementType === comp.settlementType && comp?.last !== undefined) {
    const key =
      comp?.securityID.split("-")[4] === "USD" ? "DOLAR_MEP" : "DOLAR_CABLE";

    const cotizacionArs = ars.last.price > 0 ? ars.last.price : 1;
    const cotizacionComp = comp.last.price > 0 ? comp.last.price : 1;
    const cotizacion =
      cotizacionArs / cotizacionComp === 1 ? 1 : cotizacionArs / cotizacionComp;
    return {
      instrumento: key,
      settlementType: ars.settlementType,
      price: cotizacion,
    };
  }
}

export function pairInstruments(arrOfInstrumentos: Array<Instrumento>) {
  const instruments = [];
  for (let i = 0; i < arrOfInstrumentos.length; i++) {
    for (let j = i + 1; j < arrOfInstrumentos.length; j++) {
      if (
        arrOfInstrumentos[i].securityID.split("-")[0].includes("AL30") &&
        arrOfInstrumentos[i].securityID.split("-")[4].includes("ARS") &&
        arrOfInstrumentos[j].securityID.split("-")[0].includes("AL30") &&
        arrOfInstrumentos[i].securityID.split("-")[1] ===
          arrOfInstrumentos[j].securityID.split("-")[1]
      ) {
        instruments.push([arrOfInstrumentos[i], arrOfInstrumentos[j]]);
      }
    }
  }
  return instruments;
}
