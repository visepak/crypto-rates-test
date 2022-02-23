import { Controller, Get, Query } from '@nestjs/common';
import { TGetPriceResponse } from '../service/types';
import { PriceService } from '../service/price.service';

@Controller()
export class HttpController {
  constructor(private readonly priceService: PriceService) { }

  @Get('/price')
  getPrice(@Query() params: { fsyms: string; tsyms: string }): Promise<TGetPriceResponse> {
    return this.priceService.getPrice({ ...params });
  }
}

