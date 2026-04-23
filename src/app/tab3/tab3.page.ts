import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InventoryService } from '../services/inventory';
import { InventoryItem } from '../models/inventory.model';
import { AlertController, ToastController, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonInput, IonSelect, IonSelectOption, IonButton, IonCheckbox, IonTextarea, IonItem, IonLabel, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  providers: [InventoryService],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonCheckbox,
    IonTextarea,
    IonItem,
    IonLabel,
    IonIcon  
  ],
})
export class Tab3Page implements OnInit {
  itemForm: FormGroup;
  isItemFound = false;

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    this.itemForm = this.fb.group({
      item_name: [{ value: '', disabled: true }, Validators.required],
      category: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      supplier_name: ['', Validators.required],
      stock_status: ['', Validators.required],
      featured_item: [0],
      special_note: ['']
    });
  }

  ngOnInit() {}

  searchItemByName(searchName: string) {
    if (!searchName.trim()) {
      this.showToast('Please enter an item name!');
      return;
    }

    this.inventoryService.getItemByName(searchName).subscribe({
      next: (items: InventoryItem[]) => {
        if (items && items.length > 0) {
          const item = items[0];
          this.isItemFound = true;
          this.itemForm.patchValue(item);
          this.showToast('Item found successfully!');
        } else {
          this.isItemFound = false;
          this.showToast('Item not found!');
        }
      },
      error: (err: Error) => {
        this.isItemFound = false;
        this.showToast('Search failed!');
      }
    });
  }

  updateItem() {
    if (this.itemForm.invalid) {
      this.showToast('Please fill all required fields!');
      return;
    }

    const itemName = this.itemForm.get('item_name')!.value;
    const updatedItem: InventoryItem = this.itemForm.getRawValue();

    this.inventoryService.updateItem(itemName, updatedItem).subscribe({
      next: () => {
        this.showToast('Item updated successfully!');
        this.resetForm();
      },
      error: () => {
        this.showToast('Update failed!');
      }
    });
  }

  async deleteItem() {
    const itemName = this.itemForm.get('item_name')!.value;

    const alert = await this.alertController.create({
      header: 'Confirm Deletion',
      message: `Delete ${itemName}? This action cannot be undone!`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.inventoryService.deleteItem(itemName).subscribe({
              next: () => {
                this.showToast('Item deleted!');
                this.resetForm();
              },
              error: () => {
                this.showToast('Delete failed!');
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  resetForm() {
    this.itemForm.reset({ featured_item: 0 });
    this.isItemFound = false;
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }

  async showHelp() {
    const alert = await this.alertController.create({
      header: 'Help Guide',
      message: '1. Search item by name\n2. Edit details and save\n3. Delete item (Laptop is protected)\n4. All fields marked are required',
      buttons: ['OK']
    });
    await alert.present();
  }
}