/*
 * See here: https://docs.github.com/en/rest/reference/orgs#get-an-organization
 */
class Organization {
  private readonly name: string;
  private readonly repos: Repository[];

  constructor(name: string, repos: Repository[]) {
    this.name = name;
    this.repos = repos;
  }

  containsRepo(repoName: string) => bool {
    return this.repos.filter(x = x.name == repoName);
  }
}
