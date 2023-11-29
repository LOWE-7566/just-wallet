export function describe(message: string, cb: Function) {
  console.log(`testing ${message}`);
  cb();
}

export function it(message: string, cb: Function) {
  console.log(`\t${message}`);
  cb();
}


class Expect {
  data: any;
  constructor(data: any) {
    this.data = data;
  }

  toBe(eq:any) {
    if (this.data !== eq) {
      console.log(`
      ${this.data} is not equal to ${eq}
      \n 
      + recieved ${eq}
      - expect ${this.data}
      `)
    }
  }

}

export const expect = (data: any) => new Expect(data);