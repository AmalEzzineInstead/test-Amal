const events = require('events');
const fs = require('fs');

class Parser {
  private path: string;

  constructor(path: string) {
    this.path = path;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  public parse(){
    const defaultNginxRegex = /^(.+?) \- (.+?) \[(.+?)\] "(.+?)" (.+?) (.+?) "(.+?)" "(.+?)"$/;
    const defaultNginxLogColumns = [
      'remote_addr',
      'remote_user',
      'time_local',
      'time_local',
      'status',
      'bytes_sent',
      'http_referer',
      'http_user_agent',
    ];

    const ngnixLines = [];

    const allFileContents = fs.readFileSync(this.path, 'utf-8');
    const fileLines = allFileContents.split(/\r?\n/);

    for(const line of fileLines) {
      const ngnixLogObject = {};
      const lineMatch = line.match(defaultNginxRegex);

      if (!lineMatch) {
        continue;
      }
      lineMatch.shift();

      for (let i = 0; i < lineMatch.length; i++) {
        ngnixLogObject[defaultNginxLogColumns[i]] = lineMatch[i];
      }
      ngnixLines.push(ngnixLogObject);
    }

    return ngnixLines;

    // try {
    //  const rl = readline.createInterface({
    //    // TODO: change this.path, get the value through a getter
    //    input: fs.createReadStream(this.path),
    //    crlfDelay: Infinity,
    //  });

    //  rl.on('line', (line) => {
    //    const lineMatch = line.match(defaultNginxRegex);
    //    const ngnixLogObject = {};
    //    lineMatch.shift();

    //    for(let i = 0; i < lineMatch.length; i++){
    //      ngnixLogObject[defaultNginxLogColumns[i]] = lineMatch[i];
    //    }
    //    ngnixLines.push(ngnixLogObject);
    //    console.log(ngnixLines);
    //  });

    //  await events.once(rl, 'close');

    //  return ngnixLines;

    // } catch (err) {
    //  throw new Error('An error occurred while parsing the file.');
    // }
  }
}

const parser = new Parser('./examples/sample2.log');
console.log(parser.parse());

