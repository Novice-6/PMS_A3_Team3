/**
 * Title: Tab2 Page - Add New Item & Featured Items
 * Author: Ma Xinrui and Hao Wang
 * Student ID: 24832562 and 24832782
 * Description: This page allows users to add new inventory items
 * and display items marked as featured.
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// 🌟 核心修改：从 /standalone 导入具体的组件
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, 
  IonCardTitle, IonCardContent, IonItem, IonInput, IonSelect, 
  IonSelectOption, IonCheckbox, IonTextarea, IonButton, IonList, 
  IonLabel, IonBadge, IonIcon, IonNote, IonText,
  AlertController, ToastController, LoadingController 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { star, pricetag, helpCircleOutline } from 'ionicons/icons';
import { InventoryService } from '../services/inventory';
import { InventoryItem } from '../models/inventory.model';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  // 🌟 将所有用到的组件逐一列出，这是 Angular 17 最稳妥的写法
  imports: [
    CommonModule, ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, 
    IonCardTitle, IonCardContent, IonItem, IonInput, IonSelect, 
    IonSelectOption, IonCheckbox, IonTextarea, IonButton, IonList, 
    IonLabel, IonBadge, IonIcon, IonNote, IonText
  ]
})
export class Tab2Page implements OnInit {
  public featuredItems: InventoryItem[] = [];
  public categories = ['Electronics', 'Furniture', 'Clothing', 'Tools', 'Miscellaneous'];
  public stockStatuses = ['In Stock', 'Low Stock', 'Out of Stock'];
  public addForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {
    addIcons({ star, pricetag, helpCircleOutline });

    this.addForm = this.fb.group({
      item_name: ['', [Validators.required, Validators.minLength(2)]],
      category: ['', Validators.required],
      quantity: [null, [Validators.required, Validators.min(1)]],
      price: [null, [Validators.required, Validators.min(0)]],
      supplier_name: ['', Validators.required],
      stock_status: ['', Validators.required],
      featured_item: [false],
      special_note: ['']
    });
  }

  ngOnInit(): void {
    this.loadFeaturedItems();
  }

  ionViewWillEnter() {
    this.loadFeaturedItems();
  }

  loadFeaturedItems(): void {
    this.inventoryService.getAllItems().subscribe({
      next: (data: InventoryItem[]) => {
        this.featuredItems = data.filter(item => Number(item.featured_item) === 1);
      },
      error: (err: any) => console.error('Error loading items:', err)
    });
  }

  async addNewItem(): Promise<void> {
    if (this.addForm.invalid) {
      this.showToast('Please fill all required fields', 'warning');
      return;
    }

    const loading = await this.loadingController.create({ message: 'Adding item...' });
    await loading.present();

    const formData = this.addForm.value;
    const finalData: InventoryItem = {
      ...formData,
      quantity: Number(formData.quantity),
      price: Number(formData.price),
      featured_item: formData.featured_item ? 1 : 0
    };

    this.inventoryService.createItem(finalData).subscribe({
      next: () => {
        loading.dismiss();
        this.showToast('Item successfully added!', 'success');
        this.addForm.reset({ featured_item: false });
        this.loadFeaturedItems();
      },
      error: (err: any) => {
        loading.dismiss();
        this.showToast('Error adding item: ' + err.message, 'danger');
      }
    });
  }

  async showHelp() {
    const alert = await this.alertController.create({
      header: 'Tab 2 Help Guide',
      message: 'Complete the form to add a new inventory item. Required fields are marked with *.',
      buttons: ['OK']
    });
    await alert.present();
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      color: color as any,
      position: 'bottom'
    });
    await toast.present();
  }
}