/**
 * Title: Tab2 Page - Add New Item & Featured Items
 * Author: Ma Xinrui and Hao Wang
 * Student ID: 24832562 and 24832782
 * Description: Add new inventory items and list featured items
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
import { InventoryItem } from '../models/inventory.model';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class Tab2Page implements OnInit {
  public featuredItems: InventoryItem[] = [];
  public allItems: InventoryItem[] = [];
  public categories = ['Electronics', 'Furniture', 'Clothing', 'Tools', 'Miscellaneous'];
  public stockStatuses = ['In Stock', 'Low Stock', 'Out of Stock'];

  public addForm: FormGroup = this.fb.group({
    item_name: ['', [Validators.required, Validators.minLength(2)]],
    category: ['', Validators.required],
    quantity: [null, [Validators.required, Validators.min(1)]],
    price: [null, [Validators.required, Validators.min(1)]],
    supplier_name: ['', Validators.required],
    stock_status: ['', Validators.required],
    featured_item: [false],
    special_note: [''],
  });

  private fixedInventory: InventoryItem[] = [
    { item_id: 1, item_name: "Laptop", category: "Electronics", quantity: 25, price: 1200, supplier_name: "Tech Supplier Ltd", stock_status: "In Stock", featured_item: 0, special_note: "16GB RAM" },
    { item_id: 2, item_name: "Office Chair", category: "Furniture", quantity: 18, price: 150, supplier_name: "Home Goods Co", stock_status: "In Stock", featured_item: 0, special_note: "" },
    { item_id: 3, item_name: "Cotton T-Shirt", category: "Clothing", quantity: 60, price: 25, supplier_name: "Fashion Hub", stock_status: "In Stock", featured_item: 0, special_note: "" },
    { item_id: 4, item_name: "Drill Machine", category: "Tools", quantity: 12, price: 80, supplier_name: "Tool Master", stock_status: "Low Stock", featured_item: 1, special_note: "Cordless" },
    { item_id: 5, item_name: "Wireless Mouse", category: "Electronics", quantity: 45, price: 30, supplier_name: "Tech Supplier Ltd", stock_status: "In Stock", featured_item: 0, special_note: "" },
    { item_id: 6, item_name: "Dining Table", category: "Furniture", quantity: 8, price: 300, supplier_name: "Home Goods Co", stock_status: "Low Stock", featured_item: 0, special_note: "" },
    { item_id: 7, item_name: "Winter Jacket", category: "Clothing", quantity: 32, price: 75, supplier_name: "Fashion Hub", stock_status: "In Stock", featured_item: 1, special_note: "Waterproof" },
    { item_id: 8, item_name: "Hammer Set", category: "Tools", quantity: 5, price: 20, supplier_name: "Tool Master", stock_status: "Out of Stock", featured_item: 0, special_note: "" },
    { item_id: 9, item_name: "USB Cable Pack", category: "Electronics", quantity: 100, price: 15, supplier_name: "Tech Supplier Ltd", stock_status: "In Stock", featured_item: 0, special_note: "" },
    { item_id: 10, item_name: "Bookshelf", category: "Furniture", quantity: 14, price: 90, supplier_name: "Home Goods Co", stock_status: "In Stock", featured_item: 0, special_note: "" },
    { item_id: 11, item_name: "Sneakers", category: "Clothing", quantity: 22, price: 110, supplier_name: "Fashion Hub", stock_status: "In Stock", featured_item: 0, special_note: "" },
    { item_id: 12, item_name: "Measuring Tape", category: "Tools", quantity: 70, price: 10, supplier_name: "Tool Master", stock_status: "In Stock", featured_item: 0, special_note: "" },
    { item_id: 13, item_name: "Storage Box", category: "Miscellaneous", quantity: 55, price: 12, supplier_name: "General Store", stock_status: "In Stock", featured_item: 1, special_note: "Stackable" }
  ];

  constructor(
    private fb: FormBuilder,
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  ngOnInit(): void {
    this.loadItems();
  }

  ionViewWillEnter() {
    this.loadItems();
  }

  loadItems(): void {
    this.allItems = [...this.fixedInventory];
    this.featuredItems = this.allItems.filter(item => item.featured_item === 1);
  }

  async addNewItem(): Promise<void> {
    if (this.addForm.invalid) {
      this.showToast('Please fill all required fields', 'danger');
      return;
    }

    const newName = this.addForm.value.item_name.trim().toLowerCase();
    const exists = this.allItems.some(
      item => item.item_name.toLowerCase() === newName
    );

    if (exists) {
      this.showToast('Item name already exists! Must be unique.', 'danger');
      return;
    }

    const loading = await this.loadingController.create({ message: 'Saving...' });
    await loading.present();

    const ids = this.allItems.map(i => i.item_id).filter(id => id != null);
    const maxId = ids.length > 0 ? Math.max(...ids) : 0;
    const newId = maxId + 1;

    const newItem: InventoryItem = {
      item_id: newId,
      item_name: this.addForm.value.item_name,
      category: this.addForm.value.category,
      quantity: Number(this.addForm.value.quantity),
      price: Number(this.addForm.value.price),
      supplier_name: this.addForm.value.supplier_name,
      stock_status: this.addForm.value.stock_status,
      featured_item: this.addForm.value.featured_item ? 1 : 0,
      special_note: this.addForm.value.special_note || '',
    };

    this.allItems.push(newItem);
    this.loadItems();
    this.addForm.reset({ featured_item: false });

    await loading.dismiss();
    this.showToast('Item added successfully!', 'success');
  }

  // ✅ 弹出商品详情（修复报错）
  async showItemDetails(item: InventoryItem): Promise<void> {
    const alert = await this.alertController.create({
      header: `Item Details (ID: ${item.item_id})`,
      message: `
        Name: ${item.item_name}
        Category: ${item.category}
        Quantity: ${item.quantity}
        Price: $${item.price}
        Supplier: ${item.supplier_name}
        Status: ${item.stock_status}
        Note: ${item.special_note || 'None'}
      `,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async showHelp(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Help',
      message: 'Add new items. Names must be unique. Featured items show below.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  async showToast(message: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
    });
    await toast.present();
  }
}