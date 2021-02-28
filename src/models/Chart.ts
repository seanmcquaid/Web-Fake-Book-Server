interface Chart {
  name: string;
  defaultKey: string;
  numberOfBars: number;
  bars: {
    chords: {
      functionalNumber: string;
      chordQuality: string;
      isSeventhChord: boolean;
      displayName?: string;
    }[];
  }[];
  beatsPerMeasure: number;
  noteValuePerBeat: number;
  genre: string;
}

export default Chart;
