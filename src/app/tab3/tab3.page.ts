import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InventoryService } from '../services/inventory';
import { InventoryItem } from '../models/inventory.model';
import { 
  AlertController, 
  ToastController, 
  LoadingController, // 🌟 增加加载控制器
  IonicModule 
} from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule // 🌟 直接导入 IonicModule 更简洁，包含所有离子组件
  ],
})
export class Tab3Page implements OnInit {
  itemForm: FormGroup;
  isItemFound = false;
  currentSearchName = ''; // 记录当前搜索的名字，用于更新操作

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {
    this.itemForm = this.fb.group({
      item_name: [{ value: '', disabled: true }, Validators.required], // 名称作为Key，通常不许改
      category: ['', Validators.required],
      quantity: [null, [Validators.required, Validators.min(1)]],
      price: [null, [Validators.required, Validators.min(0.01)]],
      supplier_name: ['', Validators.required],
      stock_status: ['', Validators.required],
      featured_item: [0],
      special_note: ['']
    });
  }

  ngOnInit() {}

  /**
   * 🌟 根据名称搜索
   */
  async searchItemByName(searchName: string) {
    const name = searchName?.trim();
    if (!name) {
      this.showToast('Please enter an item name!', 'warning');
      return;
    }

    const loading = await this.loadingController.create({ message: 'Searching...' });
    await loading.present();

    this.inventoryService.getItemByName(name).subscribe({
      next: (items: InventoryItem[]) => {
        loading.dismiss();
        if (items && items.length > 0) {
          const item = items[0];
          this.isItemFound = true;
          this.currentSearchName = item.item_name;
          this.itemForm.patchValue({
            ...item,
            // 确保 checkbox 逻辑正确
            featured_item: item.featured_item ? 1 : 0 
          });
          this.showToast('Item found!', 'success');
        } else {
          this.isItemFound = false;
          this.showToast('Item not found in database.', 'danger');
        }
      },
      error: (err) => {
        loading.dismiss();
        this.isItemFound = false;
        this.showToast(err.message || 'Search failed', 'danger');
      }
    });
  }

  /**
   * 🌟 实际调用 API 进行更新
   */
  async updateItem() {
    if (this.itemForm.invalid) {
      this.showToast('Please correct the errors in the form.', 'warning');
      return;
    }

    const loading = await this.loadingController.create({ message: 'Updating...' });
    await loading.present();

    // 获取表单数据，包括禁用的 item_name
    const formData = this.itemForm.getRawValue();
    
    // 数据类型转换
    const updatedData: InventoryItem = {
      ...formData,
      quantity: Number(formData.quantity),
      price: Number(formData.price),
      featured_item: formData.featured_item ? 1 : 0
    };

    this.inventoryService.updateItem(this.currentSearchName, updatedData).subscribe({
      next: () => {
        loading.dismiss();
        this.showToast('Item updated successfully!', 'success');
        this.resetForm();
      },
      error: (err) => {
        loading.dismiss();
        this.showToast(`Update failed: ${err.message}`, 'danger');
      }
    });
  }

  /**
   * 🌟 改进的删除逻辑：从服务器捕获 Laptop 错误
   */
  async deleteItem() {
    // 获取禁用的输入框的值
    const itemName = this.itemForm.getRawValue().item_name;

    const alert = await this.alertController.create({
      header: 'Confirm Deletion',
      message: `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { 
          text: 'Delete', 
          role: 'destructive', 
          handler: () => { this.executeDelete(itemName); } 
        }
      ]
    });
    await alert.present();
  }

  private async executeDelete(name: string) {
    const loading = await this.loadingController.create({ message: 'Deleting...' });
    await loading.present();

    this.inventoryService.deleteItem(name).subscribe({
      next: () => {
        loading.dismiss();
        this.showToast('Item deleted successfully.', 'success');
        this.resetForm();
      },
      error: (err) => {
        loading.dismiss();
        // 🌟 HD 关键：这里的 err.message 会包含来自服务器的 
        // "Forbidden: Removal of the item named 'Laptop' is forbidden"
        this.showToast(err.message, 'danger');
      }
    });
  }

  resetForm() {
    this.itemForm.reset({ featured_item: 0 });
    this.isItemFound = false;
    this.currentSearchName = '';
  }

  async showToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
      color: color, // 🌟 增加颜色区分
      buttons: [{ text: 'OK', role: 'cancel' }]
    });
    await toast.present();
  }

  async showHelp() {
    const alert = await this.alertController.create({
      header: 'Management Help',
      message: 'Search for an item by its unique name. Once found, you can modify its details and click Save, or choose to Delete it. Note that some system items like "Laptop" cannot be deleted.',
      buttons: ['Got it']
    });
    await alert.present();
  }
}