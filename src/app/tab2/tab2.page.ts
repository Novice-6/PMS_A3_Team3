/**
 * Title: Tab2 Page - Add New Item & Featured Items
 * Author: Ma Xinrui
 * Student ID: 24832562
 * Description: This page allows users to add new inventory items
 * and display items marked as featured.
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms'; // 🌟 显式导入 FormGroup
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
import { InventoryService } from '../services/inventory'; // 🌟 确保路径正确
import { InventoryItem } from '../models/inventory.model';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class Tab2Page implements OnInit {

  public featuredItems: InventoryItem[] = [];
  public categories = ['Electronics', 'Furniture', 'Clothing', 'Tools', 'Miscellaneous'];
  public stockStatuses = ['In Stock', 'Low Stock', 'Out of Stock'];

  // 🌟 定义表单组类型
  public addForm = this.fb.group({
    item_name: ['', [Validators.required, Validators.minLength(2)]],
    category: ['', Validators.required],
    quantity: [null, [Validators.required, Validators.min(1)]],
    price: [null, [Validators.required, Validators.min(0)]],
    supplier_name: ['', Validators.required],
    stock_status: ['', Validators.required],
    featured_item: [false], // 🌟 UI 中通常是 Boolean
    special_note: ['']
  });

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  ngOnInit(): void {
    this.loadFeaturedItems();
  }

  /**
   * 🌟 HD 改进：使用 Ionic 生命周期钩子
   * 每次进入页面时都刷新精选列表，确保数据是最新的
   */
  ionViewWillEnter() {
    this.loadFeaturedItems();
  }

  /**
   * Load all items and filter only featured ones
   */
  loadFeaturedItems(): void {
    this.inventoryService.getAllItems().subscribe({
      next: (data: InventoryItem[]) => {
        // 确保 featured_item 为 1 的才显示
        this.featuredItems = data.filter(item => Number(item.featured_item) === 1);
      },
      error: (error) => {
        this.showToast('Failed to load featured items', 'danger');
      }
    });
  }

  /**
   * Submit form to add a new item
   * 🌟 重点修改：彻底解决类型报错问题
   */
  async addNewItem(): Promise<void> {
    if (this.addForm.invalid) {
      this.showToast('Please fill all required fields correctly', 'danger');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Adding item...',
    });
    await loading.present();

    const formData = this.addForm.value;

    // 🌟 HD 级转换逻辑：解决 string | number 报错
    const finalData: InventoryItem = {
      item_name: formData.item_name || '',
      category: (formData.category as any) || 'Miscellaneous',
      // 强制转换类型，确保符合模型要求
      quantity: Number(formData.quantity) || 0,
      price: Number(formData.price) || 0,
      supplier_name: formData.supplier_name || '',
      stock_status: (formData.stock_status as any) || 'Out of Stock',
      // 将 Checkbox 的 true/false 转换为 API 要求的 1/0
      featured_item: formData.featured_item ? 1 : 0,
      special_note: formData.special_note || ''
    };

    this.inventoryService.createItem(finalData).subscribe({
      next: () => {
        loading.dismiss();
        this.showToast('Item added successfully!', 'success');
        this.addForm.reset({ featured_item: false });
        this.loadFeaturedItems(); 
      },
      error: (error) => {
        loading.dismiss();
        // 尝试从 API 错误中获取具体信息
        const errorMsg = error.message || 'Failed to add item.';
        this.showToast(errorMsg, 'danger');
      }
    });
  }

  /**
   * Show help information with customized content for this page
   */
  async showHelp(): Promise<void> {
    const helpAlert = await this.alertController.create({
      header: 'Tab 2 Help Guide',
      subHeader: 'Adding New Items',
      message: '1. Fill in the item details.\n2. Quantity & Price must be positive numbers.\n3. Featured items will appear in the list below.',
      buttons: ['Understood']
    });
    await helpAlert.present();
  }

  async showToast(message: string, color: 'success' | 'danger' | 'warning'): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      color,
      buttons: [{ text: 'Dismiss', role: 'cancel' }] // 🌟 HD 细节：增加关闭按钮
    });
    await toast.present();
  }
}