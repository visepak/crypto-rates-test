import { PriceEntity } from "../orm/entity/price.entity";
import { TGetPriceResponse, TFsym, TTsym, TPriceType, TPrice } from "./types";




export const convertPriceMapToArr = (priceMap: TGetPriceResponse): PriceEntity[] => {
    const result: PriceEntity[] = [];
    const priceMappedByFsym: Record<TFsym, Record<TTsym, Record<TPriceType, TPrice>>> = {}
    for (const type in priceMap) {
        for (const fsym in priceMap[type]) {
            if (!priceMappedByFsym[fsym]) { priceMappedByFsym[fsym] = {} }
            for (const tsym in priceMap[type][fsym]) {
                if (!priceMappedByFsym[fsym][tsym]) { priceMappedByFsym[fsym][tsym] = {} as Record<TPriceType, TPrice> }
                priceMappedByFsym[fsym][tsym][type] = priceMap[type][fsym][tsym];
            }
        }
    }
    for (const fsym in priceMappedByFsym) {
        for (const tsym in priceMappedByFsym[fsym]) {
            result.push({ fsym, tsym, price: priceMappedByFsym[fsym][tsym] })
        }
    }
    return result
}


export const convertPriceArrToMap = (priceArr: PriceEntity[]): TGetPriceResponse => {
    return priceArr.reduce((acc, val) => {
        if (!acc.RAW[val.fsym]) { acc.RAW[val.fsym] = {} }
        acc.RAW[val.fsym][val.tsym] = val.price['RAW']
        if (!acc.DISPLAY[val.fsym]) { acc.DISPLAY[val.fsym] = {} }
        acc.DISPLAY[val.fsym][val.tsym] = val.price['DISPLAY']
        return acc
    }, { RAW: {}, DISPLAY: {} } as TGetPriceResponse);
}
