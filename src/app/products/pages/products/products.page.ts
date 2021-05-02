import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductsService } from '../../services/products.service';
import { Observable } from 'rxjs';
import { Products } from '../../interface/products-interface';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {

  products: Observable<Products[]>;
  allProducts: Products[] = [];

  isUpdating: boolean = false;

  productId = '';

  categorias = [
    {
      name: 'qweqweqwe'
    },
    {
      name: 'asdasdasd'
    },
    {
      name: 'zxczxczxc'
    }
  ]

  constructor(private formBuilder: FormBuilder,
              private productsService: ProductsService ) {
        this.products = productsService.getAllProducts();
        this.products.subscribe( products => {
          this.allProducts = products;
        });
  }

  form: FormGroup = this.formBuilder.group({

    name: [ '', [ Validators.required ] ],
    barCode: [ '', [ Validators.required ] ],
    unitPrice: [ 0, [ Validators.required ] ],
    stock: [ 0, [ Validators.required ] ],
    category: [ '', [ Validators.required ] ],
    provider: [ '', [ Validators.required ] ]

  });

  ngOnInit(): void {

  }

  // Guardar Producto
  onAdd(): void {
    this.productsService.addProduct( this.form.value );
    this.form.reset();
  }

  // Eliminar Producto
  onDelete( id: string ): void {
    this.productsService.deleteProduct( id );
  }

  fillFormToUpdate( product: Products ): void {
    // Obtener todos los capmos de la tabla
    const { unitPrice, stock, provider, barCode, category, id, name } = product;
    this.productId = id;

    // Asignar todos los campos al formulario
    this.form.get('name').setValue( name );
    this.form.get('barCode').setValue( barCode );
    this.form.get('unitPrice').setValue( unitPrice );
    this.form.get('stock').setValue( stock );
    this.form.get('category').setValue( category );
    this.form.get('provider').setValue( provider );

    // Mostrar el botón de actualizar
    this.isUpdating = true;
  }

  cancel(): void {
    this.form.reset();
    this.isUpdating = false;
  }

  onUpdate() {

    const name = this.form.get('name').value;
    const barCode = this.form.get('barCode').value;
    const unitPrice = this.form.get('unitPrice').value;
    const stock = this.form.get('stock').value;
    const category = this.form.get('category').value;
    const provider = this.form.get('provider').value;
    const id = this.productId;
    
    const product = {
      name,
      barCode,
      unitPrice,
      stock,
      category,
      provider,
      id
    }

    this.productsService.updateProduct( product );
    this.isUpdating = false;
    this.form.reset();
  }
}
