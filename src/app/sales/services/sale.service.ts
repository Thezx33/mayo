import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Products } from '../../products/interface/products-interface';
import { ProductsService } from '../../products/services/products.service';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  constructor(
    private productsService: ProductsService
  ) { }

  async getProductByBarCode( barCode: string ) {
    const product = await this.productsService.getProductByBarCode( barCode );
    console.log( product );
  }
}
