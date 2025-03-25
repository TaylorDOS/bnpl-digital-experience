// types/item.ts
export type Item = {
    name: string;
    price: number;
  };

export type ItemList = {
    items: Item[];
    selectedItemIndex: number;
}