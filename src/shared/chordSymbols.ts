export type ChordTypes =
  | 'Dominant'
  | 'Major'
  | 'Minor'
  | 'Half Diminished'
  | 'Diminished'
  | 'Augmented'
  | 'Minor Major';

const chordSymbols = {
  Dominant: '',
  Major: '△',
  Minor: '-',
  'Half Diminished': 'Ø',
  Diminished: 'O',
  Augmented: '+',
  'Minor Major': '-△',
};

export default chordSymbols;
