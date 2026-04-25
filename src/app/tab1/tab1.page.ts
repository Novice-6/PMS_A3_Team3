/**
 * Title: Tab1 Page - Inventory List & Search
 * Author: Ma Xinrui
 * Student ID: 24832562
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
   * Load all inventory items from the server
   */
  loadAllItems(): void {
    this.inventoryService.getAllItems().subscribe({
      next: (data: InventoryItem[]) => {
        this.allItems = data;
        this.displayedItems = [...data];
      },
      error: (error) => {
        this.showToast('Failed to load items', 'danger');
        console.error('Error loading items:', error);
      }
    });
  }

  /**
   * Setup search with debounce to avoid frequent API calls
   */
  setupSearch(): void {
    this.searchSubject.pipe(
      debounceTime(300), // 300ms debounce time
      tap(() => {
        const keyword = this.searchTerm.trim();
        if (!keyword) {
          this.displayedItems = [...this.allItems];
        }
      }),
      switchMap((searchTerm) => {
        const keyword = searchTerm.trim();
        if (!keyword) {
          return [];
        }
        return this.inventoryService.getItemByName(keyword);
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
   * @param message Message to display
   * @param color Toast color
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