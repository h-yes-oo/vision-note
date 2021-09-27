export class Transcription {
  add: (text: any, isFinal: boolean) => void;

  contructor(cfg) {
    let index = 0;
    const list: any[] = [];

    this.add = (text, isFinal) => {
      list[index] = text;
      if (isFinal) {
        index += 1;
      }
    };

    this.toString = () => {
      return list.join('. ');
    };
  }
}
