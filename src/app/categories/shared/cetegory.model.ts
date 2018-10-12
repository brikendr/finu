export class Category {
  id: string;
  description: string;
  logo: string;
  color: string;

  constructor(options: any) {
    this.id = options.id;
    this.description = options.description;
    this.logo = options.logo;
    this.color = options.color;
  }
}
