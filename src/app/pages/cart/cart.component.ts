import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription } from 'rxjs';
import { CartItem } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cartSub: Subscription
  cartProducts = [];
  cartQuantity: any;
  UpdatedQuantity: number;
  total: number;
  totalPrice: number;
  percentage: number;
  amount: any;

  constructor(private cartService: CartService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.cartQuantity = [1, 2, 3, 4, 5];
    this.total = 0
    this.totalPrice = 0
    this.amount = 0;

    this.getCartProducts();

    this.getTotalAmount();
  }


  getCartProducts(){
    var cart = JSON.parse(localStorage.getItem('cart'));
    cart.forEach(product => {
      // console.log(product);
      this.cartProducts.push(product);
    });
    // console.log(this.cartProducts);
  }

  getTotalAmount(){
    this.cartProducts.forEach(cartDetail => {
      this.total += cartDetail.product.price * cartDetail.quantity;
    })
    this.percentage = this.total * 2 / 100;
    this.amount = this.total + this.percentage;
  }

  getSelectedQty(ev: Event, id: string){
    // console.log((ev.target as HTMLInputElement).value);
    const UpdatedQuantity = +(ev.target as HTMLInputElement).value;
    let cart: any = JSON.parse(localStorage.getItem('cart'));
    // console.log(cart);
    for (var i = 0; i < cart.length; i++){
      if(cart[i].product.id == id){
        cart[i].quantity = UpdatedQuantity;
		    localStorage.setItem("cart", JSON.stringify(cart));
      }
    }
    // console.log(cart);
    this.loadCart();
  }


  remove(id: string) {
		let cart: any = JSON.parse(localStorage.getItem('cart'));
    // console.log(cart);
		let index: number = -1;
		for (var i = 0; i < cart.length; i++) {
			let item: CartItem = cart[i];
      // console.log(item);
			if (item.product.id == id) {
				cart.splice(i, 1);
				break;
			}
		}
		localStorage.setItem("cart", JSON.stringify(cart));
    this.cartQuantity = cart.length;
    this.toastr.info('Product removed from cart!');
    this.cartService.cartUpdated.next({ quantity: this.cartQuantity });
    this.loadCart();
    this.cartQuantity = [1, 2, 3, 4, 5];
	}

  loadCart(){
    let cart: any = JSON.parse(localStorage.getItem('cart'));
    // console.log(cart);
    // console.log(this.cartProducts);
    this.cartProducts = cart;
    this.total = 0
    this.getTotalAmount();
  }

}
