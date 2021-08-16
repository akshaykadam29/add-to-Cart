import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { mimeType } from 'src/app/validators/mime-type.validator';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  imagePreview;

  productForm: FormGroup;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.productForm = new FormGroup({
      name: new FormControl(null, { validators: [Validators.required] }),
      description: new FormControl(null, { validators: [Validators.required] }),
      price: new FormControl(null, { validators: [Validators.required, Validators.minLength(2)] }),
      productImage: new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] })
    });
  }

  onImagePicked(event: Event){
    // console.log((event.target as HTMLInputElement).files[0]);
    const file = (event.target as HTMLInputElement).files[0];

    this.productForm.patchValue({ productImage: file });

    this.productForm.get('productImage').updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    }
    reader.readAsDataURL(file);
  }

  onAddProduct(){
    console.log(this.productForm.value);
    this.productService.addProduct(this.productForm.value.name, this.productForm.value.description, this.productForm.value.price, this.productForm.value.productImage);
  }

}
