import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartUpdated = new Subject<{quantity: number}>();

  constructor(private http: HttpClient) { }

  getCartUpdateListener(){
    return this.cartUpdated.asObservable();
  }

  // getCartProducts(id: string){
  //   return this.http.get<{ product: any }>('http://localhost:3000/api/products/' + id);
  // }

}
