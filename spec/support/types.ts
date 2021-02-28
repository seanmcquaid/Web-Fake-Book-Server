import { Response } from 'supertest';
import Chart from 'src/models/Chart';

export interface IResponse extends Response {
  body: {
    chart: Chart;
    error: string;
    currentKey: string;
  };
}
