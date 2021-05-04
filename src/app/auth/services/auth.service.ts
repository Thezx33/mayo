import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { User } from '../interface/user-interface';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { firebaseUser } from '../interface/firebase-user-interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  usersCollection: string = 'users';
  user$: Observable<User>;

  constructor( 
    private alertController: AlertController,
    private afa: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router ) {
      this.user$ = this.afa.authState.pipe(
        switchMap( user => {
          if ( user ) {
            return this.afs.doc<User>( `${ this.usersCollection }/${ user.uid }` ).valueChanges();
          }
          return of( null );
        })
      );
    } // Constructor

    async registerWithEmailPassword( email: string, password: string, User: User ): Promise<firebaseUser> {
      try {
        const { user } = await this.afa.createUserWithEmailAndPassword( email, password );
        // Enviar correo de verificación.
        await this.sendEmailVerification();

        // Asigna las propiedades del usuario de firebase y el usuario del formulario a un único registro.
        const userRecord = { ...user, ...User };
        // Crea el registro del usuario
        this.updateUserData( userRecord );

        return user;
      } catch ( err ) {
        console.log("🚀 ~ file: auth.service.ts ~ line 20 ~ AuthService ~ registerEmailPassword ~ err", err);
      }
    } // Registrar con correo y contraseña

    async loginWithEmailPassword( email: string, password: string ): Promise<firebaseUser> {
      try {
        
        const { user } = await this.afa.signInWithEmailAndPassword( email, password );
        
        this.updateUserData( user );
        return user;
      } catch ( err ) {
        console.log("🚀 ~ file: auth.service.ts ~ line 52 ~ AuthService ~ loginWithEmailPassword ~ err", err);
      }
    } // Iniciar sesión con correo y contraseña.

    async sendEmailVerification() {
      try {
        (await this.afa.currentUser).sendEmailVerification();
      } catch ( err ) {
        console.log("🚀 ~ file: auth.service.ts ~ line 33 ~ AuthService ~ sendEmailVerification ~ err", err);
        console.log( err.code );
      }
    } // Enviar correo de verificación.

    isEmailVerified( user: firebaseUser ): Boolean {
      return user.emailVerified === true ? true : false;
    } // Correo verificado

    async addUser( user: User ): Promise<void> {
      try {
        const userRef: AngularFirestoreDocument<firebaseUser> = this.afs.doc(`users/${ user.uid }`);
        return userRef.set( user, { merge: true } );

      } catch ( error ) {
        console.log("🚀 ~ file: auth.service.ts ~ line 36 ~ AuthService ~ addUser ~ error", error );
      }
    } // Añadir usuario ( registro en firestore )

    private updateUserData( user: firebaseUser ): Promise<void> {
      const userRef: AngularFirestoreDocument<firebaseUser> = this.afs.doc(`users/${ user.uid }`);
  
      // Información que se registrará en la base de datos.
      const data = {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
      };
  
      return userRef.set( data, { merge: true } );
    
    } // Actualizar información del usuario

    async resetPassword( email: string ): Promise<void> {
      try {
        return await this.afa.sendPasswordResetEmail( email );
      } catch ( error ) {
        console.log("🚀 ~ file: auth.service.ts ~ line 63 ~ AuthService ~ resetPassword ~ error", error)   
      }
    } // Reiniciar contraseña

    async logout(): Promise<void> {
      try {
        return await this.afa.signOut();
      } catch ( error ) {
        console.log("🚀 ~ file: auth.service.ts ~ line 91 ~ AuthService ~ logout ~ error", error)
      }
    } // Cerrar sesión
}
