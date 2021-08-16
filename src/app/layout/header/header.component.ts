import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  quantity: number = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.getCartUpdateListener()
      .subscribe(result => {
        this.quantity = result.quantity;
      })

    const cart = JSON.parse(localStorage.getItem('cart'));
    if(cart.length == null){
      this.quantity = 0
    } else {
      this.quantity = cart.length;
    }
  }

}
