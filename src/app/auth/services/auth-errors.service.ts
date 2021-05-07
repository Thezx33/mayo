import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthErrorsService {

  constructor( private alertCtrl: AlertController ) { }

  async errorAlert( errorCode: string ) {

    switch ( errorCode ) {
      case 'auth/email-already-in-use':
        await this.presentAlert( 'Este correo electrónico ya está registrado.' );
      break;

      case 'auth/invalid-email':
        await this.presentAlert( 'El correo electrónico no es válido.' );
      break;
      
      case 'auth/wrong-password':
        await this.presentAlert( 'La contraseña es inválida o el usuario no tiene una contraseña.' );
      break;

      case 'auth/user-not-found':
        await this.presentAlert( 'No hay un usuario con este correo electrónico.' );
      break;

      case 'auth/email-already-in-use':
        await this.presentAlert( 'Este correo ya ésta registrado.' );
      break;
      default:
        break;
    }

  }

  async presentAlert( message: string ) {

    const alert = await this.alertCtrl.create({
      header: '',
      message,
      buttons: ['OK']
    });

    await alert.present();

  }

}
