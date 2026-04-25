/**
 * Title: Tab1 Page - Inventory List & Search
 * Author: Ma Xinrui
 * Student ID: 24832562
 * Description: Display all inventory items and search items by name
 */

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class Tab1Page implements OnInit {

  private readonly API_URL = 'https://prog2005.it.scu.edu.au/ArtGalley';

  public allItems: any[] = [];
  public displayedItems: any[] = [];
  public searchTerm = '';

  constructor(
    private http: HttpClient,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.loadAllItems();
  }

  loadAllItems(): void {
    this.http.get<any[]>(this.API_URL).subscribe({
      next: (data: any[]) => {
        this.allItems = data;
        this.displayedItems = [...data];
      },
      error: () => {
        alert('Failed to load items');
      }
    });
  }

  searchItem(): void {
    const keyword = this.searchTerm.trim().toLowerCase();

    if (!keyword) {
      this.displayedItems = [...this.allItems];
      return;
    }

    this.displayedItems = this.allItems.filter(item =>
      item.item_name.toLowerCase().includes(keyword)
    );
  }

  async showHelp(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Help Guide',
      message: 'This page shows all inventory items. You can search items by name using the search bar.',
      buttons: ['OK']
    });
    await alert.present();
  }
}