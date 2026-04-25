/**
 * Title: Tab2 Page - Add New Item & Featured Items
 * Author: Ma Xinrui
 * Student ID: 24832562
 * Description: Add new inventory item and show featured items
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class Tab2Page implements OnInit {

  private readonly API_URL = 'https://prog2005.it.scu.edu.au/ArtGalley';

  public featuredItems: any[] = [];
  public categories = ['Electronics', 'Furniture', 'Clothing', 'Tools', 'Miscellaneous'];
  public stockStatuses = ['In Stock', 'Low Stock', 'Out of Stock'];

  addForm = this.fb.group({
    item_name: ['', Validators.required],
    category: ['', Validators.required],
    quantity: ['', [Validators.required, Validators.min(1)]],
    price: ['', [Validators.required, Validators.min(0)]],
    supplier_name: ['', Validators.required],
    stock_status: ['', Validators.required],
    featured_item: [0],
    special_note: ['']
  });

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.loadFeaturedItems();
  }

  loadFeaturedItems(): void {
    this.http.get<any[]>(this.API_URL).subscribe({
      next: (data: any[]) => {
        this.featuredItems = data.filter(i => i.featured_item === 1);
      }
    });
  }

  addNewItem(): void {
    if (this.addForm.invalid) {
      alert('Please fill all required fields');
      return;
    }

    this.http.post(this.API_URL, this.addForm.value).subscribe({
      next: () => {
        alert('Item added successfully!');
        this.addForm.reset({ featured_item: 0 });
        this.loadFeaturedItems();
      },
      error: () => {
        alert('Failed to add item');
      }
    });
  }

  async showHelp(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Help Guide',
      message: 'Fill the form to add a new item. Mark as featured to display it in the list below.',
      buttons: ['OK']
    });
    await alert.present();
  }
}