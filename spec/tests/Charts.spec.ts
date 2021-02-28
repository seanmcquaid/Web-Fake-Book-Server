import supertest from 'supertest';
import StatusCodes from 'http-status-codes';
import { SuperTest, Test } from 'supertest';
import app from '@server';
import ChartDao from '@daos/Chart/ChartDao';
import { pErr } from '@shared/functions';
import { chartAlreadyExistsError, noChartExistsError } from '@shared/constants';
import { IResponse } from '../support/types';

describe('Charts Routes', () => {
  const { BAD_REQUEST, CREATED, OK } = StatusCodes;
  let agent: SuperTest<Test>;

  beforeAll((done) => {
    agent = supertest.agent(app);
    done();
  });

  describe('POST - /charts/add', () => {
    it('chartExists already returns bad status code', (done) => {
      const body = {
        name: 'Tune Name Here',
        defaultKey: 'F',
        numberOfBars: 1,
        bars: [
          {
            chords: [
              {
                functionalNumber: 'b2',
                chordQuality: 'Major',
                isSeventhChord: true,
              },
              {
                functionalNumber: '1',
                chordQuality: 'Minor',
                isSeventhChord: true,
              },
              {
                functionalNumber: '%',
                chordQuality: '%',
                isSeventhChord: false,
              },
              {
                functionalNumber: '%',
                chordQuality: '%',
                isSeventhChord: false,
              },
            ],
          },
        ],
        beatsPerMeasure: 4,
        noteValuePerBeat: 4,
        genre: 'Standard',
      };

      spyOn(ChartDao, 'findOne').and.returnValue(Promise.resolve(true) as any);

      spyOn(ChartDao, 'create').and.returnValue();

      agent
        .post('/charts/add')
        .type('form')
        .send(body)
        .end((err: Error, res: IResponse) => {
          pErr(err);
          expect(res.status).toBe(BAD_REQUEST);
          expect(res.body.error).toEqual(chartAlreadyExistsError);
          done();
        });
    });

    it('Chart is created successfully', (done) => {
      const body = {
        name: 'Tune Name Here',
        defaultKey: 'F',
        numberOfBars: 1,
        bars: [
          {
            chords: [
              {
                functionalNumber: 'b2',
                chordQuality: 'Major',
                isSeventhChord: true,
              },
              {
                functionalNumber: '1',
                chordQuality: 'Minor',
                isSeventhChord: true,
              },
              {
                functionalNumber: '%',
                chordQuality: '%',
                isSeventhChord: false,
              },
              {
                functionalNumber: '%',
                chordQuality: '%',
                isSeventhChord: false,
              },
            ],
          },
        ],
        beatsPerMeasure: 4,
        noteValuePerBeat: 4,
        genre: 'Standard',
      };

      spyOn(ChartDao, 'findOne').and.returnValue(Promise.resolve(false) as any);

      spyOn(ChartDao, 'create').and.returnValue();

      agent
        .post('/charts/add')
        .type('form')
        .send(body)
        .end((err: Error, res: IResponse) => {
          pErr(err);
          expect(res.status).toBe(CREATED);
          expect(res.body.error).toBeUndefined();
          done();
        });
    });
  });

  describe('GET - /charts/all', () => {
    it('All charts return', (done) => {
      spyOn(ChartDao, 'find').and.returnValue(Promise.resolve() as any);

      agent.get('/charts/all').end((err: Error, res: IResponse) => {
        pErr(err);
        expect(res.status).toBe(OK);
        done();
      });
    });
  });

  describe('GET - /charts/chart/:id/:key*?', () => {
    const chart = {
      name: 'Tune Name Here',
      defaultKey: 'F',
      numberOfBars: 1,
      bars: [
        {
          chords: [
            {
              functionalNumber: 'b2',
              chordQuality: 'Major',
              isSeventhChord: true,
            },
            {
              functionalNumber: '1',
              chordQuality: 'Minor',
              isSeventhChord: true,
            },
            {
              functionalNumber: '%',
              chordQuality: '%',
              isSeventhChord: false,
            },
            {
              functionalNumber: '%',
              chordQuality: '%',
              isSeventhChord: false,
            },
          ],
        },
      ],
      beatsPerMeasure: 4,
      noteValuePerBeat: 4,
      genre: 'Standard',
    };

    it('Chart not found returns bad status code', (done) => {
      spyOn(ChartDao, 'findOne').and.returnValue(Promise.resolve(false) as any);

      agent.get('/charts/chart/IDHERE').end((err: Error, res: IResponse) => {
        pErr(err);
        expect(res.status).toBe(BAD_REQUEST);
        expect(res.body.error).toEqual(noChartExistsError);
        done();
      });
    });
    it('Default key is used if key is not provided', (done) => {
      spyOn(ChartDao, 'findOne').and.returnValue(
        Promise.resolve({ toJSON: () => chart }) as any
      );

      agent.get('/charts/chart/IDHERE').end((err: Error, res: IResponse) => {
        pErr(err);
        expect(res.status).toBe(OK);
        expect(res.body.chart.bars[0].chords[0].displayName).toEqual('Gb△7');
        expect(res.body.chart.bars[0].chords[1].displayName).toEqual('F-7');
        expect(res.body.currentKey).toEqual('F');
        done();
      });
    });

    it('Provided key is used', (done) => {
      spyOn(ChartDao, 'findOne').and.returnValue(
        Promise.resolve({ toJSON: () => chart }) as any
      );

      agent.get('/charts/chart/IDHERE/G').end((err: Error, res: IResponse) => {
        pErr(err);
        expect(res.status).toBe(OK);
        expect(res.body.chart.bars[0].chords[0].displayName).toEqual('Ab△7');
        expect(res.body.chart.bars[0].chords[1].displayName).toEqual('G-7');
        expect(res.body.currentKey).toEqual('G');
        done();
      });
    });
  });

  describe('PUT - /charts/edit/:id', () => {
    it('Chart does not exist returns a bad status code', (done) => {
      spyOn(ChartDao, 'findOne').and.returnValue(Promise.resolve(false) as any);

      agent
        .put('/charts/edit/IDHERE')
        .type('form')
        .send({})
        .end((err: Error, res: IResponse) => {
          pErr(err);
          expect(res.status).toBe(BAD_REQUEST);
          expect(res.body.error).toEqual(noChartExistsError);
          done();
        });
    });

    it('After chart is edited successfully, returns a good status code', (done) => {
      spyOn(ChartDao, 'findOne').and.returnValue(Promise.resolve(true) as any);

      spyOn(ChartDao, 'findOneAndUpdate').and.returnValue(
        Promise.resolve() as any
      );

      agent
        .put('/charts/edit/IDHERE')
        .type('form')
        .send({})
        .end((err: Error, res: IResponse) => {
          pErr(err);
          expect(res.status).toBe(OK);
          done();
        });
    });
  });

  describe('DELETE - /charts/delete/:id', () => {
    it('Returns valid status code when deleted', (done) => {
      spyOn(ChartDao, 'findByIdAndDelete').and.returnValue(
        Promise.resolve() as any
      );

      agent
        .delete('/charts/delete/IDHERE')
        .end((err: Error, res: IResponse) => {
          pErr(err);
          expect(res.status).toBe(OK);
          done();
        });
    });
  });
});
