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
      'request',
      'status',
      'bytes_sent',
      'http_referer',
      'http_user_agent',
    ];

    try {
      const ngnixLines = [];
      const allFileContents = fs.readFileSync(this.path, 'utf-8');
      const fileLines = allFileContents.split(/\r?\n/);

      for(const line of fileLines) {
        const ngnixLogObject = {};
        const lineMatch = line.match(defaultNginxRegex);

        // skip lines that don't  match regex including empty lines
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
    } catch (err) {
      throw new Error('An error occurred while parsing the file.');
    }

  }
}
