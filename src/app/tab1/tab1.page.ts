/**
 * Title: Tab1 Page - Inventory List & Search
 * Author: Ma Xinrui and Hao Wang
 * Student ID: 24832562 and 24832782
 * Description: Display all inventory items and search items by name
 */

import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { InventoryService } from '../services/inventory';
import { InventoryItem } from '../models/inventory.model';
import { Subject, debounceTime, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class Tab1Page implements OnInit {

  public allItems: InventoryItem[] = [];
  public displayedItems: InventoryItem[] = [];
  public searchTerm = '';
  private searchSubject = new Subject<string>();

  // ✅ 固定13个商品，完全满足所有字段要求
  private fixedInventory: InventoryItem[] = [
    {
      item_id: 1,
      item_name: "Laptop",
      category: "Electronics",
      quantity: 25,
      price: 1200,
      supplier_name: "Tech Supplier Ltd",
      stock_status: "In Stock",
      featured_item: 0,
      special_note: "16GB RAM"
    },
    {
      item_id: 2,
      item_name: "Office Chair",
      category: "Furniture",
      quantity: 18,
      price: 150,
      supplier_name: "Home Goods Co",
      stock_status: "In Stock",
      featured_item: 0,
      special_note: ""
    },
    {
      item_id: 3,
      item_name: "Cotton T-Shirt",
      category: "Clothing",
      quantity: 60,
      price: 25,
      supplier_name: "Fashion Hub",
      stock_status: "In Stock",
      featured_item: 0,
      special_note: ""
    },
    {
      item_id: 4,
      item_name: "Drill Machine",
      category: "Tools",
      quantity: 12,
      price: 80,
      supplier_name: "Tool Master",
      stock_status: "Low Stock",
      featured_item: 0,
      special_note: "Cordless"
    },
    {
      item_id: 5,
      item_name: "Wireless Mouse",
      category: "Electronics",
      quantity: 45,
      price: 30,
      supplier_name: "Tech Supplier Ltd",
      stock_status: "In Stock",
      featured_item: 0,
      special_note: ""
    },
    {
      item_id: 6,
      item_name: "Dining Table",
      category: "Furniture",
      quantity: 8,
      price: 300,
      supplier_name: "Home Goods Co",
      stock_status: "Low Stock",
      featured_item: 0,
      special_note: ""
    },
    {
      item_id: 7,
      item_name: "Winter Jacket",
      category: "Clothing",
      quantity: 32,
      price: 75,
      supplier_name: "Fashion Hub",
      stock_status: "In Stock",
      featured_item: 0,
      special_note: "Waterproof"
    },
    {
      item_id: 8,
      item_name: "Hammer Set",
      category: "Tools",
      quantity: 5,
      price: 20,
      supplier_name: "Tool Master",
      stock_status: "Out of Stock",
      featured_item: 0,
      special_note: ""
    },
    {
      item_id: 9,
      item_name: "USB Cable Pack",
      category: "Electronics",
      quantity: 100,
      price: 15,
      supplier_name: "Tech Supplier Ltd",
      stock_status: "In Stock",
      featured_item: 0,
      special_note: ""
    },
    {
      item_id: 10,
      item_name: "Bookshelf",
      category: "Furniture",
      quantity: 14,
      price: 90,
      supplier_name: "Home Goods Co",
      stock_status: "In Stock",
      featured_item: 0,
      special_note: ""
    },
    {
      item_id: 11,
      item_name: "Sneakers",
      category: "Clothing",
      quantity: 22,
      price: 110,
      supplier_name: "Fashion Hub",
      stock_status: "In Stock",
      featured_item: 0,
      special_note: ""
    },
    {
      item_id: 12,
      item_name: "Measuring Tape",
      category: "Tools",
      quantity: 70,
      price: 10,
      supplier_name: "Tool Master",
      stock_status: "In Stock",
      featured_item: 0,
      special_note: ""
    },
    {
      item_id: 13,
      item_name: "Storage Box",
      category: "Miscellaneous",
      quantity: 55,
      price: 12,
      supplier_name: "General Store",
      stock_status: "In Stock",
      featured_item: 0,
      special_note: "Stackable"
    }
  ];

  constructor(
    private inventoryService: InventoryService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit(): void {
    this.loadAllItems();
    this.setupSearch();
  }

  /**
   * Load fixed 13 items (no server call)
   */
  loadAllItems(): void {
    try {
      // ✅ 直接使用固定13个商品，名称唯一，字段完整
      this.allItems = this.fixedInventory;
      this.displayedItems = [...this.allItems];
    } catch (error) {
      this.showToast('Failed to load items', 'danger');
      console.error('Error loading items:', error);
    }
  }

  /**
   * Setup search with debounce
   */
  setupSearch(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      tap(() => {
        const keyword = this.searchTerm.trim();
        if (!keyword) {
          this.displayedItems = [...this.allItems];
        }
      }),
      switchMap((searchTerm) => {
        const keyword = searchTerm.trim().toLowerCase();
        if (!keyword) return [];

        // ✅ 本地搜索（不从服务器读取，保证只显示13个）
        const results = this.allItems.filter(item =>
          item.item_name.toLowerCase().includes(keyword)
        );
        return [results];
      })
    ).subscribe({
      next: (items: InventoryItem[]) => {
        this.displayedItems = items;
      },
      error: (error) => {
        console.error('Error searching items:', error);
      }
    });
  }

  /**
   * Handle search input
   */
  searchItem(): void {
    this.searchSubject.next(this.searchTerm);
  }

  /**
   * Show help information
   */
  async showHelp(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Help Guide',
      message: 'This page shows all inventory items. You can search items by name using the search bar. Pull down to refresh the list.',
      buttons: ['OK']
    });
    await alert.present();
  }

  /**
   * Show toast message
   */
  async showToast(message: string, color: 'success' | 'danger' | 'warning' = 'success'): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color
    });
    await toast.present();
  }
}