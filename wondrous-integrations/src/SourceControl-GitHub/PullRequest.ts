/**
 * See response to "get pull request" for all available fields:
 * https://docs.github.com/en/rest/reference/pulls#list-pull-requests
 */
export class PullRequest {
  title: string;

  id: number;

  number: number;

  constructor(title: string, id: number, number: number) {
    this.title = title;
    this.id = id;
    this.number = number;
  }
}

module.exports = {
  PullRequest,
};
