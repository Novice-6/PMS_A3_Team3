/**
 * Title: Tab2 Page - Add New Item & Featured Items
 * Author: Ma Xinrui
 * Student ID: 24832562
 * Description: Allows user to add new inventory items and displays featured items
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  // API endpoint
  private readonly API_URL = 'https://prog2005.it.scu.edu.au/ArtGalley';

  // Featured items list
  public featuredItems: any[] = [];

  // Dropdown options
  public categories = ['Electronics', 'Furniture', 'Clothing', 'Tools', 'Miscellaneous'];
  public stockStatuses = ['In Stock', 'Low Stock', 'Out of Stock'];

  // Add item form with validation
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
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadFeaturedItems();
  }

  /**
   * Load items where featured_item = 1
   */
  loadFeaturedItems(): void {
    this.http.get<any[]>(this.API_URL).subscribe({
      next: (data) => {
        this.featuredItems = data.filter(item => item.featured_item === 1);
      }
    });
  }

  /**
   * Submit new item to API
   */
  addNewItem(): void {
    if (this.addForm.invalid) {
      alert('Please fill all required fields correctly');
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

  /**
   * Show help information
   */
  showHelp(): void {
    alert('Help: Fill the form to add a new item. Featured items are shown below.');
  }
}