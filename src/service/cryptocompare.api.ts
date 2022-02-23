import { Injectable, OnModuleInit } from '@nestjs/common';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { CRYPTOCOMPARRE_URL } from 'src/app.config';
import { TGetPriceRequest, TGetPriceResponse } from './types';


@Injectable()
export class CryptoCompareApiService implements OnModuleInit {
    api: AxiosInstance

    onModuleInit() {
        this.api = axios.create({
            baseURL: CRYPTOCOMPARRE_URL,
        })
    }

    async getPrice(request: TGetPriceRequest): Promise<TGetPriceResponse> {
        try {
            return await this.get<TGetPriceResponse>('/data/pricemultifull', { fsyms: request.fsyms, tsyms: request.tsyms });
        } catch (error) {
            throw new Error(`[getPrice] failing with error ${error.message}`);
        }
    }

    private async get<T>(url: string, params: Record<string, string>): Promise<T> {
        const response = await this.api.get(url, { params });
        return this.getValue<T>(response);
    }

    private getValue<T>(response: AxiosResponse<T>): T {
        if (response.status === 200) {
            return response.data;
        } else if (response.status) {
            throw new Error(response.statusText);
        } else {
            throw new Error('undefined error');
        }
    }

}
