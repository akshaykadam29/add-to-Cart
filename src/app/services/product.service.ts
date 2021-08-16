import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  products: any;
  productsupdated = new Subject<{products: Product[]}>();

  constructor(private http: HttpClient) { }

  getProducts(){
    this.http.get<{ message: string, products: any }>('http://localhost:3000/api/products')
      .pipe(map((productData) => {
        return {
          products : productData.products.map(product => {
            return {
              id: product._id,
              name: product.name,
              description: product.description,
              price: product.price,
              productImage: product.productImgPath
            }
          })
        }
      }))
      .subscribe(response => {
        // console.log(response.products);
        this.products = response.products;
        this.productsupdated.next({ products: [...this.products] });
      });
  }

  getProductsUpdateListener(){
    return this.productsupdated.asObservable();
  }

  addProduct(name: string, description: string, price: any, productImage: File){
    const productData = new FormData();
    productData.append('name', name);
    productData.append('description', description);
    productData.append('price', price);
    productData.append('productImage', productImage, name);

    this.http.post<{ message: string }>('http://localhost:3000/api/products', productData)
      .subscribe(response => {
        console.log(response.message);
      });
  }

}
