import mongoose, { Schema } from 'mongoose';

const chartSchema = new Schema({
  name: String,
  defaultKey: String,
  numberOfBars: Number,
  bars: {
    type: [
      {
        chords: [
          {
            functionalNumber: Schema.Types.Mixed,
            isSeventhChord: Boolean,
            chordQuality: String,
          },
        ],
      },
    ],
    default: undefined,
  },

  beatsPerMeasure: Number,
  noteValuePerBeat: Number,
  genre: String,
});

const ChartDao = mongoose.model('Chart', chartSchema);

export default ChartDao;
