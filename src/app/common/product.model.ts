export class ProductModel {
  $key: string;
  name: string;
  parts: PartItem[];
}

export class PartItem {
  name: string;
  amount: number;

  constructor(name: string, amount: number) {
    this.name = name;
    this.amount = amount;
  }
}
