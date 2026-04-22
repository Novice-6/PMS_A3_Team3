/**
 * Title: Tab1 Page - Inventory List & Search
 * Author: Ma Xinrui
 * Student ID: 24832562
 * Description: Displays all inventory items and supports searching by item name
 */

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  // API endpoint provided by assignment
  private readonly API_URL = 'https://prog2005.it.scu.edu.au/ArtGalley';

  // Store all items and filtered items
  public allItems: any[] = [];
  public displayedItems: any[] = [];
  public searchTerm: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Load all items when page initialized
    this.loadAllItems();
  }

  /**
   * Load all inventory items from API
   */
  loadAllItems(): void {
    this.http.get<any[]>(this.API_URL).subscribe({
      next: (data) => {
        this.allItems = data;
        this.displayedItems = data;
      },
      error: () => {
        alert('Failed to load inventory items');
      }
    });
  }

  /**
   * Search item by name, show result or revert to full list
   */
  searchItem(): void {
    const keyword = this.searchTerm.trim().toLowerCase();

    if (!keyword) {
      this.displayedItems = this.allItems;
      return;
    }

    this.http.get(`${this.API_URL}/${keyword}`).subscribe({
      next: (item) => {
        this.displayedItems = [item];
      },
      error: () => {
        alert('Item not found');
        this.displayedItems = [];
      }
    });
  }

  /**
   * Show help information
   */
  showHelp(): void {
    alert('Help: View all inventory items. Search by entering an item name.');
  }
}