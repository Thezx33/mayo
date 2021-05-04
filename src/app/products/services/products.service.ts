import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Products } from '../interface/products-interface';


@Injectable({
  providedIn: 'root'
})

export class ProductsService {

  productsCollection: AngularFirestoreCollection;
  products: Observable<Products[]>;

  constructor( private af: AngularFirestore ) {
          // Obtener datos cuando se produzca un cambio ( ingresar, actualizar, eliminar )    
          this.productsCollection = this.af.collection('products');
          this.products = this.productsCollection.snapshotChanges()
                          .pipe(
                            map(
                              actions => {
                                return actions.map( a => {
                                  const data = a.payload.doc.data() as Products;
                                  data.id = a.payload.doc.id;
                                  return data;
                                }); // actions / map 
                              } // actions
                            ) // map 
                          ) // pipe 
  } // constructor

  // Añadir producto
  async addProduct( product: Products ): Promise<void> {
    try {
      await this.af.collection('products').add( product );
    } catch ( err ) {
      console.log("🚀 ~ file: products.service.ts ~ line 39 ~ ProductsService ~ addProduct ~ err", err)
    }
  }

  // Obtener todos los productos
  getAllProducts(): Observable<Products[]>{
    try {
      return this.products;
    } catch ( err ) {
      console.log("🚀 ~ file: products.service.ts ~ line 48 ~ ProductsService ~ getAllProduct ~ err", err);
    }

  }

  // Eliminar producto
  async deleteProduct( id: string ): Promise<void> {

    try {
      await this.af.collection('products').doc( id ).delete();
    } catch ( err ) {
      console.log("🚀 ~ file: products.service.ts ~ line 60 ~ ProductsService ~ deleteProduct ~ err", err);
    }
  }

  // Actualizar producto
  async updateProduct( product: Products ): Promise<void> {
    try {
      const id = product.id;
      this.af.collection('products').doc( id ).update( product );
    } catch ( err ) {
      console.log("🚀 ~ file: products.service.ts ~ line 68 ~ ProductsService ~ updateProduct ~ err", err)
    }
  }
}