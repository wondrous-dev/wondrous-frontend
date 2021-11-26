/**
 * See response to "get repo issues" for all available fields:
 * https://docs.github.com/en/rest/reference/issues#list-repository-issues
 */
export class Issue {
  title: string;

  id: number;

  number: number;

  constructor(title: string, id: number, number: number) {
    this.title = title;
    this.id = id;
    this.number = number;
  }
}
