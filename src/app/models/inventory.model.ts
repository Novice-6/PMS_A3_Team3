// src/app/models/inventory.model.ts

export interface InventoryItem {
  item_id?: number; // 数据库自增字段，加了 '?' 代表可选
  item_name: string; // 必须，且用来作为查询和删除的关键字段
  category: 'Electronics' | 'Furniture' | 'Clothing' | 'Tools' | 'Miscellaneous';
  quantity: number;
  price: number;
  supplier_name: string;
  stock_status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  featured_item: number; // 0 代表不是精选，1 代表是精选
  special_note?: string; // 可选的特殊备注
}