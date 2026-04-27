/**
 * Title: Tab1 Page - Inventory List & Search
 * Author: Ma Xinrui and Hao Wang
 * Student ID: 24832562 and 24832782
 * Description: Display all inventory items and search items by name
 */

import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../services/inventory';
import { InventoryItem } from '../models/inventory.model';
import { Subject, debounceTime, switchMap, tap } from 'rxjs';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonRefresher, 
  IonRefresherContent, IonSearchbar, IonCard, IonCardHeader, 
  IonCardTitle, IonCardSubtitle, IonCardContent, IonBadge, 
  IonSkeletonText, IonIcon, IonButton, IonButtons,
  AlertController, ToastController 
} from '@ionic/angular/standalone';
import { chevronDownOutline, archiveOutline, helpCircleOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonRefresher, 
    IonRefresherContent, IonSearchbar, IonCard, IonCardHeader, 
    IonCardTitle, IonCardSubtitle, IonCardContent, IonBadge, 
    IonSkeletonText, IonIcon, IonButton,FormsModule
  ]
})
  
export class Tab1Page implements OnInit {

  public allItems: InventoryItem[] = [];
  public displayedItems: InventoryItem[] = [];
  public searchTerm = '';
  public isLoading = false;
  private searchSubject = new Subject<string>();

  constructor(
    private inventoryService: InventoryService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    addIcons({ chevronDownOutline, archiveOutline, helpCircleOutline });
  }

  ngOnInit(): void {
    this.loadData(); // 初始加载
    this.setupSearch();
  }

  /**
   * 统一的数据加载逻辑
   * @param event 可选的刷新事件对象
   */
  loadData(event?: any): void {
    if (!event) this.isLoading = true; // 只有非下拉刷新时才显示骨架屏

    this.inventoryService.getAllItems().subscribe({
      next: (data: InventoryItem[]) => {
        // 过滤无效数据
        this.allItems = data.filter(item => item.item_name && item.item_name.trim() !== '');
        this.displayedItems = [...this.allItems];
        
        this.finishLoading(event); // 停止加载状态
      },
      error: (error) => {
        this.showToast('Failed to load items', 'danger');
        console.error('Error loading items:', error);
        this.finishLoading(event); // 出错也要停止，防止卡死
      }
    });
  }

  /**
   * 辅助方法：结束加载状态
   */
  private finishLoading(event?: any) {
    this.isLoading = false;
    if (event) {
      event.target.complete(); // 停止下拉刷新的转圈  
    }
  }

  setupSearch(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      switchMap((searchTerm) => {
        const keyword = searchTerm.trim();
        if (!keyword) {
          this.displayedItems = [...this.allItems];
          return [];
        }
        this.isLoading = true; // 搜索时也显示加载感
        return this.inventoryService.getItemByName(keyword);
      })
    ).subscribe({
      next: (items: InventoryItem[]) => {
        this.displayedItems = items;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error searching items:', error);
        this.isLoading = false;
      }
    });
  }

  searchItem(): void {
    this.searchSubject.next(this.searchTerm);
  }

  /**
   * Show help information
   */
  async showHelp(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Tab 1 Help Guide',
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