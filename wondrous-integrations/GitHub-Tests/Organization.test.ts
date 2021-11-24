const { Organization } = require('../GitHub/Organization.ts');
const { Repository } = require('../GitHub/Repository.ts');

const repoA = new Repository("a");
const repoB = new Repository("b");
const org = new Organization("foo", [repoA, repoB]);

test('Organization contains repo', () => {
  expect(org.containsRepo("a")).toBe(true);
});

test('Organization does not contain repo', () => {
  expect(org.containsRepo("c")).toBe(false);
});
