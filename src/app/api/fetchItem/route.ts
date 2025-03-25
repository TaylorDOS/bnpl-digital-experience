import { NextResponse } from "next/server";
import { Item } from "../../types/item";

export async function GET()  {
    const items: Item[] = [
        { name: "Apple", price: 2 },
        { name: "Banana", price: 1 },
        { name: "Cherry", price: 3 },
        { name: "Grapes", price: 4 },
        { name: "Orange", price: 2 },
        { name: "Pineapple", price: 5 },
        { name: "Strawberry", price: 6 },
        { name: "Watermelon", price: 8 },
        { name: "Mango", price: 3 },
        { name: "Blueberry", price: 7 },
        { name: "Peach", price: 4 },
        { name: "Plum", price: 3 },
        { name: "Pomegranate", price: 5 },
        { name: "Lemon", price: 2 },
        { name: "Coconut", price: 6 },
        { name: "Papaya", price: 4 },
        { name: "Kiwi", price: 3 },
        { name: "Pear", price: 2 },
        { name: "Fig", price: 5 },
        { name: "Raspberry", price: 6 },
        { name: "Blackberry", price: 6 },
        { name: "Apricot", price: 4 },
        { name: "Cantaloupe", price: 7 },
        { name: "Grapefruit", price: 3 },
        { name: "Dragonfruit", price: 9 },
        { name: "Lychee", price: 5 },
        { name: "Persimmon", price: 4 },
        { name: "Gooseberry", price: 6 },
        { name: "Tangerine", price: 3 }
    ];
    return NextResponse.json(items, { status: 200 });
}