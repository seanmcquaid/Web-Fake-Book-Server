import Chart from 'src/models/Chart';
import chordSymbols, { ChordTypes } from './chordSymbols';
import keys, { KeyTypes } from './keys';

const transposeChart = (chart: Chart, key: KeyTypes): Chart => {
  const transposedBars = chart.bars.map((bar) => {
    const chords = bar.chords.map((chord) => {
      const newChord = { ...chord };
      const functionalNumber = newChord.functionalNumber;
      const chordQuality = newChord.chordQuality;
      const isSeventhChord = newChord.isSeventhChord;
      const keyName: { [key: string]: string } = keys[key];
      const chordName = keyName[functionalNumber];
      const chordSymbol = chordSymbols[chordQuality as ChordTypes];
      newChord.displayName =
        chordName === '%'
          ? ''
          : `${chordName}${chordSymbol}${isSeventhChord ? '7' : ''}`;
      return newChord;
    });

    return {
      chords,
    };
  });

  return { ...chart, bars: transposedBars };
};

export default transposeChart;
