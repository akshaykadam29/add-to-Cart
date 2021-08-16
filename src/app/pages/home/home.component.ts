import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product.model';
import { CartItem } from 'src/app/models/cart.model';
import { ToastrService } from 'ngx-toastr';
import { CartService } from 'src/app/services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  productSub: Subscription;
  products: Product[] = [];
  product: Product;

  constructor(private productService: ProductService, private toastr: ToastrService, private cartService: CartService) { }

  ngOnInit(): void {
    this.productService.getProducts();
    this.productSub = this.productService.getProductsUpdateListener()
      .subscribe((response: { products: Product[] }) => {
        // console.log(response.products);
        this.products = response.products;
    })
    this.checkCart();
  }

  checkCart(){
    const cart: any = JSON.parse(localStorage.getItem('cart'));
    for (var i = 0; i < cart.length; i++){
      const filtered = this.products.filter(p => {
        console.log(p.id);
      });
      console.log(filtered);
    }
  }

  addToCart(productId){
    const product = this.products.find(pro => pro.id == productId);
    var item: CartItem = {
      product: product,
      quantity: 1,
      isActive: true
    }
    if(localStorage.getItem('cart') == null){
      var cart: any = [];
      cart.push(item);
      localStorage.setItem('cart', JSON.stringify(cart));
      var productQuantity = 1;
      this.toastr.success('Product added in cart!')
      this.cartService.cartUpdated.next({quantity: productQuantity});
    } else {
      const cart: any = JSON.parse(localStorage.getItem('cart'));
      let index: any = -1;
      for (var i = 0; i < cart.length; i++){
        if(cart[i].product.id == productId){
          index = i;
          break;
        }
      }
      if(index == -1){
        var item: CartItem = {
          product: product,
          quantity: 1,
          isActive: true
        }
        cart.push(item);
        localStorage.setItem('cart', JSON.stringify(cart));
        let productQuantity = cart.length;
        this.cartService.cartUpdated.next({quantity: productQuantity});
        this.toastr.success('Product added in cart!')
      } else {
        let item: CartItem = cart[index];
        if(item.quantity < 5){
          item.quantity += 1;
          cart[index] = item;
          localStorage.setItem("cart", JSON.stringify(cart));
          this.toastr.success('Product updated in cart!');
        }
      }
    }
  }

  ngOnDestroy(){
    this.productSub.unsubscribe();
  }
}
