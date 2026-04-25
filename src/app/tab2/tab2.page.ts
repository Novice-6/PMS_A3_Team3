/**
 * Title: Tab2 Page - Add New Item & Featured Items
 * Author: Ma Xinrui
 * Student ID: 24832562
 * Description: This page allows users to add new inventory items
 * and display items marked as featured.
 */

// Import required Angular and Ionic modules
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

  // Backend API URL for inventory operations
  private readonly API_URL = 'https://prog2005.it.scu.edu.au/ArtGalley';

  // Array to store items marked as featured
  public featuredItems: any[] = [];

  // Dropdown options for item category
  public categories = ['Electronics', 'Furniture', 'Clothing', 'Tools', 'Miscellaneous'];

  // Dropdown options for stock status
  public stockStatuses = ['In Stock', 'Low Stock', 'Out of Stock'];

  // Reactive form for adding new items with validation rules
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

  // Constructor: inject required services
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private alertController: AlertController
  ) {}

  // Initialize page and load featured items
  ngOnInit(): void {
    this.loadFeaturedItems();
  }

  /**
   * Load all items and filter only featured ones
   */
  loadFeaturedItems(): void {
    this.http.get<any[]>(this.API_URL).subscribe({
      next: (data: any[]) => {
        this.featuredItems = data.filter(item => item.featured_item === 1);
      }
    });
  }

  /**
   * Submit form to add a new item to the database
   * Fixed: convert boolean checkbox value to number (1/0) for API compatibility
   */
  addNewItem(): void {
    // Show error message if form is invalid
    if (this.addForm.invalid) {
      alert('Please fill all required fields correctly.');
      return;
    }

    // Get raw form value
    const formData = this.addForm.value;

    // Convert boolean to number (required by backend API)
    const finalData = {
      ...formData,
      featured_item: formData.featured_item ? 1 : 0
    };

    // Send POST request to add new item
    this.http.post(this.API_URL, finalData).subscribe({
      next: () => {
        alert('Item added successfully!');
        this.addForm.reset({ featured_item: 0 });
        this.loadFeaturedItems(); // Refresh list
      },
      error: () => {
        alert('Failed to add item. Please try again.');
      }
    });
  }

  /**
   * Show help information using Ionic alert popup
   */
  async showHelp(): Promise<void> {
    const helpAlert = await this.alertController.create({
      header: 'Help Guide',
      message: 'Fill out the form to add a new item. Check "Mark as Featured" to show it below.',
      buttons: ['OK']
    });

    await helpAlert.present();
  }
}