import { Inject, Injectable, Logger, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PriceEntity } from '../orm/entity/price.entity';
import { CryptoCompareApiService } from './cryptocompare.api';
import { TGetPriceRequest, TGetPriceResponse, TSyms, CACHE } from './types';
import * as LRUcache from 'lru-cache';
import { Interval } from '@nestjs/schedule';
import { ConfigEntity } from 'src/orm/entity/config.entity';
import { convertPriceArrToMap, convertPriceMapToArr } from './utils';

@Injectable()
export class PriceService implements OnApplicationBootstrap, OnModuleInit {

  private priceCache = new LRUcache({ max: 1, maxAge: 1000 * 60 * 2 });
  private supportedSyms: TSyms = {} as TSyms;
  private logger: Logger = new Logger('PriceService');

  constructor(
    @Inject(CryptoCompareApiService) private readonly cryptoCompareApiService: CryptoCompareApiService,
    @InjectRepository(PriceEntity) private readonly priceRepo: Repository<PriceEntity>,
    @InjectRepository(ConfigEntity) private readonly configRepo: Repository<ConfigEntity>,

  ) { }


  async onModuleInit() {
    const getPriceRequestConfig = await this.configRepo.find();
    this.supportedSyms.fsyms = [...new Set([
      'BTC',
      ...getPriceRequestConfig.filter(item => item.isFsym).map(item => item.sym)
    ])];
    this.supportedSyms.tsyms = [...new Set([
      'USD',
      ...getPriceRequestConfig.filter(item => item.isTsym).map(item => item.sym)
    ])];
  }

  async onApplicationBootstrap() {
    this.updatePrice();
    this.savePriceToDb();
  }

  @Interval(10000)
  private async updatePrice() {
    const price: TGetPriceResponse = await this.getPriceFromApi(this.supportedSyms);
    this.priceCache.set(CACHE.PRICE, convertPriceMapToArr(price));
  }

  @Interval(10000)
  private async savePriceToDb() {
    if (this.priceCache.has(CACHE.PRICE)) {
      const price = this.priceCache.get(CACHE.PRICE) as PriceEntity[];
      await this.priceRepo.save(price);
    }
  }

  async getPrice(data: TGetPriceRequest): Promise<TGetPriceResponse> {
    const requestSyms = {
      fsyms: data.fsyms.split(','),
      tsyms: data.tsyms.split(','),
    }
    const isRequestFsymsSupported = requestSyms.fsyms.every(r => this.supportedSyms.fsyms.indexOf(r) >= 0)
    const isRequestTsymsSupported = requestSyms.tsyms.every(r => this.supportedSyms.tsyms.indexOf(r) >= 0)

    if (!!isRequestFsymsSupported && !!isRequestTsymsSupported) {
      const price = this.priceCache.get(CACHE.PRICE) as PriceEntity[];
      if (!price) {
        throw new Error("getPrice error");
      }
      const resultArrPrice = price.filter(item => requestSyms.fsyms.includes(item.fsym) && requestSyms.tsyms.includes(item.tsym));
      return convertPriceArrToMap(resultArrPrice)
    }
    try {
      const requestPriceFromApi = await this.getPriceFromApi(requestSyms);
      await this.updatePriceConfig(requestSyms);
      return requestPriceFromApi
    } catch (error) {
      this.logger.error(error);
      throw new Error("getPrice error");
    }
  }

  private async updatePriceConfig(data: TSyms): Promise<void> {
    const unSupportedSyms = {
      fsyms: data.fsyms.filter(sym => !this.supportedSyms.fsyms.includes(sym)),
      tsyms: data.tsyms.filter(sym => !this.supportedSyms.tsyms.includes(sym)),
    };

    for (const sym of unSupportedSyms.fsyms) {
      await this.configRepo.insert({ sym, isFsym: true, isTsym: false });
    }
    for (const sym of unSupportedSyms.tsyms) {
      await this.configRepo.insert({ sym, isTsym: true, isFsym: false })
    }

    this.supportedSyms.fsyms = this.supportedSyms.fsyms.concat(unSupportedSyms.fsyms);
    this.supportedSyms.tsyms = this.supportedSyms.tsyms.concat(unSupportedSyms.tsyms);
  }

  private async getPriceFromApi(data: TSyms): Promise<TGetPriceResponse> {
    return await this.cryptoCompareApiService.getPrice({
      fsyms: data.fsyms.join(','),
      tsyms: data.tsyms.join(','),
    });
  }

}
