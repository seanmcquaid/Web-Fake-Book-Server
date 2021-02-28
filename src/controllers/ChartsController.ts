import { Request, Response } from 'express';
import StatusCodes from 'http-status-codes';
import ChartDao from '@daos/Chart/ChartDao';
import { chartAlreadyExistsError, noChartExistsError } from '@shared/constants';
import transposeChart from '@shared/transposeChart';
import Chart from 'src/models/Chart';
import { KeyTypes } from '@shared/keys';

const { BAD_REQUEST, CREATED, OK } = StatusCodes;

class ChartsController {
  public static postAddChart = async (req: Request, res: Response) => {
    const chartInfo = req.body;
    const chartExists = await ChartDao.findOne({ name: chartInfo.name });

    if (chartExists) {
      return res.status(BAD_REQUEST).json({
        error: chartAlreadyExistsError,
      });
    }
    await ChartDao.create(chartInfo);
    return res.status(CREATED).end();
  };

  public static getAllCharts = async (req: Request, res: Response) => {
    const charts = await ChartDao.find({});
    return res.status(OK).json({ charts });
  };

  public static getChart = async (req: Request, res: Response) => {
    const { id, key } = req.params;
    const foundChart = await ChartDao.findOne({ _id: id });
    if (!foundChart) {
      return res.status(BAD_REQUEST).json({
        error: noChartExistsError,
      });
    }

    const chart: Chart = foundChart.toJSON() as any;
    const transposedChart: Chart = transposeChart(
      chart,
      key ? (key as KeyTypes) : (chart.defaultKey as KeyTypes)
    );

    return res.status(OK).json({
      chart: transposedChart,
      currentKey: key ? key : chart.defaultKey,
    });
  };

  public static deleteChart = async (req: Request, res: Response) => {
    const { id } = req.params;
    await ChartDao.findByIdAndDelete(id);
    return res.status(OK).end();
  };

  public static editChart = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { chartInfo } = req.body;
    const chartExists = await ChartDao.findOne({ _id: id });
    if (!chartExists) {
      return res.status(BAD_REQUEST).json({
        error: noChartExistsError,
      });
    }
    const filter = { _id: id };

    await ChartDao.findOneAndUpdate(filter, chartInfo);
    return res.status(OK).end();
  };
}

export default ChartsController;
