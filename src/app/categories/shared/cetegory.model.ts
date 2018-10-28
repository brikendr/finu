export class Category {
  id: string;
  name: string;
  logo: string;
  description: string;
  colorClass?: string;

  constructor(options: any) {
    this.id = options.id;
    this.name = options.name;
    this.logo = String.fromCharCode(parseInt(options.logo, 16));
    this.description = options.description;
    this.colorClass = options.colorClass;
  }
}
