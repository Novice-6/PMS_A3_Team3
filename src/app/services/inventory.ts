import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { InventoryItem } from '../models/inventory.model'; 

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  // SCU 提供的远程 API 地址
  private readonly API_URL = 'https://prog2005.it.scu.edu.au/ArtGalley';

  constructor(private http: HttpClient) { }

  // 1. 获取所有物品
  getAllItems(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(this.API_URL).pipe(
      catchError(this.handleError)
    );
  }

  // 2. 根据名字搜索特定物品
  getItemByName(name: string): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(`${this.API_URL}/${name}`).pipe(
      catchError(this.handleError)
    );
  }

  // 3. 添加新物品
  createItem(item: InventoryItem): Observable<any> {
    return this.http.post(this.API_URL, item).pipe(
      catchError(this.handleError)
    );
  }

  // 4. 更新已有物品
  updateItem(name: string, item: InventoryItem): Observable<any> {
    return this.http.put(`${this.API_URL}/${name}`, item).pipe(
      catchError(this.handleError)
    );
  }

  // 5. 删除物品
  deleteItem(name: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${name}`).pipe(
      catchError(this.handleError)
    );
  }

  // 统一错误处理拦截器
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      // 客户端或网络故障
      errorMessage = `Network Error: ${error.error.message}`;
    } else {
      // 后端 API 报错（处理删除 Laptop 时的 403/400 错误）
      // 这里提取后端传回的 JSON 错误信息，如果没有则显示状态码
      const serverMessage = error.error?.message || error.error?.error || error.message;
      errorMessage = `Server Error (${error.status}): ${serverMessage}`;
    }
    
    console.error('API Error intercepted:', errorMessage);
    // 把错误信息继续抛出，让页面组件去显示 Toast 提示给用户
    return throwError(() => new Error(errorMessage));
  }
}