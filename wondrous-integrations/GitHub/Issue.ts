/*
 * See here: https://docs.github.com/en/rest/reference/orgs#get-an-organization
 */
 export class Issue {
   title: string;
   id: number;
   number: number;

   constructor(
     title: string,
     id: number,
     number: number,
   ) {
     this.title = title;
     this.id = id;
     this.number = number;
   }
 }
