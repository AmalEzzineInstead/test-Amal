const fs = require('fs');

interface INginxLogObject{
  remote_addr: string;
  remote_user: string;
  time_local: string;
  request: string;
  status: string;
  bytes_sent: string;
  http_referer: string;
  http_user_agent: string;
}

class Parser {
  /**
   * @property {string} path - File's path
   */
  private path: string;

  constructor(path: string) {
    this.path = path;
  }

  /**
   * @property {Function} parse - parses the file with the given path
   * @returns {Array<{INginxLogObject>} - Nginx Log Object
  */
  public parse(): Array<INginxLogObject>{

    const fileLines = this.fileLines();

    return this.mapFileLines(fileLines);
  }

  /**
   * @private function to read a file content and return file lines as array
   * @param {boolean} ignoreEmptyLines - if true return file lines with empty lines filtered, if false return file lines including empty ones
   * @returns {array} - file lines
   */
  private fileLines(ignoreEmptyLines: boolean = true): Array<string>{
    const allFileContents = fs.readFileSync(this.path, 'utf-8');

    if(ignoreEmptyLines) {
      return allFileContents.split(/\r?\n/).filter((el) => el !== '');
    }
    else return allFileContents.split(/\r?\n/);
  }

  /**
   * @private function to read a file content and return file lines as array
   * @param {string} fileLine - some line from read file
   * @returns INginxLogObject | Record<string, never> - file line mapped as an object or if line doesn't match, an empty object
   */
  private mapFileLineToNgnixLogObject(fileLine: string): INginxLogObject | Record<string, never> {
    const defaultNginxLogRegex = /^(.+?) \- (.+?) \[(.+?)\] "(.+?)" (.+?) (.+?) "(.+?)" "(.+?)"$/;
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
    const ngnixLogObject = {};

    const lineMatch = fileLine.match(defaultNginxLogRegex);

    if (!lineMatch) {
      return ngnixLogObject;
    }

    for (let i = 1; i < lineMatch.length; i++) {
      ngnixLogObject[defaultNginxLogColumns[i - 1]] = lineMatch[i];
    }

    return ngnixLogObject;
  }

  /**
   * @private function to map file lines to objects
   * @param {Array<string>} fileLines - lines from the file as array
   * @param {boolean} ignoreUnmatchedLines - if false aborts file parsing if there is a line that does not match regex
   * @returns Array<INginxLogObject> - File lines that match Nginx log default format
   */
  private mapFileLines(fileLines: string[], ignoreUnmatchedLines = true){
    const nginxLogObjects = [];

    for(const [index, line] of fileLines.entries()) {
      const nginxLogObject = this.mapFileLineToNgnixLogObject(line);

      if (Object.keys(nginxLogObject).length !== 0) nginxLogObjects.push(nginxLogObject);
      else if (!ignoreUnmatchedLines) throw Error(`the line number ${index + 1} does not respect the nginx default format`);
    }

    return nginxLogObjects;
  }
}

