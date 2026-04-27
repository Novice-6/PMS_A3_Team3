import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, 
  IonCardTitle, IonCardContent, IonItem, IonInput, IonSelect, 
  IonSelectOption, IonCheckbox, IonTextarea, IonButton, IonList, 
  IonLabel, IonBadge, IonIcon, IonNote, IonText,
  AlertController, ToastController, LoadingController, IonButtons } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { searchOutline, saveOutline, trashOutline, helpCircleOutline } from 'ionicons/icons';
import { InventoryService } from '../services/inventory';
import { InventoryItem } from '../models/inventory.model';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, 
    IonCardTitle, IonCardContent, IonItem, IonInput, IonSelect, 
    IonSelectOption, IonCheckbox, IonTextarea, IonButton,  
    IonBadge, IonIcon, 
  ],
})
export class Tab3Page implements OnInit {
  public itemForm: FormGroup;
  public isItemFound: boolean = false;
  public currentSearchName: string = '';

  // 补全分类数组，解决 HTML 中的 *ngFor 报错
  public categories = ['Electronics', 'Furniture', 'Clothing', 'Tools', 'Miscellaneous'];
  public stockStatuses = ['In Stock', 'Low Stock', 'Out of Stock'];

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {
    // 注册图标，防止安卓端图标消失
    addIcons({ searchOutline, saveOutline, trashOutline, helpCircleOutline });

    // 初始化表单
    this.itemForm = this.fb.group({
      item_id: [null], // 加入 ID 字段以便在 UI 显示
      item_name: [{ value: '', disabled: true }, Validators.required],
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
   * 根据名称搜索库存项
   * @param searchName 用户输入的名称
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
          // 将获取到的数据填充进表单
          this.itemForm.patchValue({
            ...item,
            featured_item: item.featured_item ? 1 : 0 
          });
          this.showToast('Item found!', 'success');
        } else {
          this.isItemFound = false;
          this.showToast('Item not found.', 'danger');
        }
      },
      error: (err: any) => {
        loading.dismiss();
        this.isItemFound = false;
        this.showToast('Error: ' + err.message, 'danger');
      }
    });
  }

  /**
   * 调用 API 更新当前物品
   */
  async updateItem() {
    if (this.itemForm.invalid) {
      this.showToast('Form invalid. Please check inputs.', 'warning');
      return;
    }

    const loading = await this.loadingController.create({ message: 'Updating...' });
    await loading.present();

    // getRawValue 可以获取到被 disabled 的 item_name 字段
    const formData = this.itemForm.getRawValue();
    
    const updatedData: InventoryItem = {
      ...formData,
      quantity: Number(formData.quantity),
      price: Number(formData.price),
      featured_item: formData.featured_item ? 1 : 0
    };

    this.inventoryService.updateItem(this.currentSearchName, updatedData).subscribe({
      next: () => {
        loading.dismiss();
        this.showToast('Updated successfully!', 'success');
        this.resetForm();
      },
      error: (err: any) => {
        loading.dismiss();
        this.showToast(`Update failed: ${err.message}`, 'danger');
      }
    });
  }

  /**
   * 弹出确认框并处理删除逻辑
   */
  async deleteItem() {
    const itemName = this.itemForm.getRawValue().item_name;

    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: `Are you sure you want to delete "${itemName}"?`,
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

  /**
   * 实际执行删除 API 动作，捕获 Laptop 报错
   */
  private async executeDelete(name: string) {
    // 强制拦截逻辑：无论服务器报不报错，前端必须遵守 Laptop 保护
    if (name.trim().toLowerCase() === 'laptop') {
      this.showToast("Forbidden: Removal of the item named 'Laptop' is forbidden to ensure data persistence.", 'danger');
      return; // 直接拦截，不发请求，保护数据
    }

    const loading = await this.loadingController.create({ 
      message: 'Deleting item...',
      spinner: 'crescent'
    });
    await loading.present();

    this.inventoryService.deleteItem(name).subscribe({
      next: (res) => {
        loading.dismiss();
        // 这里的 res 可能是服务器返回的 JSON
        this.showToast(`Item "${name}" has been successfully removed.`, 'success');
        this.resetForm();
      },
      error: (err) => {
        loading.dismiss();
        // 捕获服务器抛出的任何其他错误
        this.showToast('Error: ' + (err.message || 'Server error occurred'), 'danger');
      }
    });
  }

  /**
   * 重置表单并隐藏编辑区域
   */
  resetForm() {
    this.itemForm.reset({ featured_item: 0 });
    this.isItemFound = false;
    this.currentSearchName = '';
  }

  /**
   * 通用 Toast 提示
   */
  async showToast(message: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
      color: color,
      buttons: [{ text: 'Dismiss', role: 'cancel' }]
    });
    await toast.present();
  }

  /**
   * 帮助弹窗
   */
  async showHelp() {
    const alert = await this.alertController.create({
      header: 'Tab 3 Help Guide',
      message: '1. Search for an item by name.\n2. Modify details and click Save.\n3. Delete item (System items like Laptop are protected).',
      buttons: ['OK']
    });
    await alert.present();
  }
}