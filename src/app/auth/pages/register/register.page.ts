import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuController, AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";

  constructor( private formBuilder: FormBuilder,
               private menu: MenuController,
               private alertCtrl: AlertController,
               private router: Router,
               private authService: AuthService, ) {
                this.menu.enable( false, 'first' );
              }

  form: FormGroup = this.formBuilder.group({
    name: [ '', [ Validators.required ] ],
    lastName: [ '', [ Validators.required ] ],
    email: [ '', [ Validators.required, Validators.pattern( this.emailPattern ) ], ],
    phone: [ '', [ Validators.required ] ],
    password: [ '', [ Validators.required ] ],
    password2: [ '', [ Validators.required ] ]
  })

  ngOnInit() {
  }

  async onRegister() {

    const { email, password } = this.form.value;

    const userForm = this.form.value;
    delete userForm.password;
    delete userForm.password2;

    try {
      const user = await this.authService.registerWithEmailPassword( email, password, userForm );

      if ( user ) {
        // Alerta para verificar correo
        const userData = {
          name: this.form.get('name').value,
          lastName: this.form.get('lastName').value,
          email: this.form.get('email').value,
          emailVerified: user.emailVerified,
          phone: this.form.get('phone').value,
          role: 'Empleado',
          uid: user.uid
        }
        this.authService.addUser( userData );
      }
    } catch ( err ) {
      console.log("🚀 ~ file: register.page.ts ~ line 40 ~ RegisterPage ~ onRegister ~ err", err);
    }

  }

    // Verify Email Alert
    async verifyEmailAlert() {
      const alert = await this.alertCtrl.create({
        header: 'Registrado correctamente',
        message: 'Verifique su correo',
        buttons: [
          {
            text: 'OK',
            handler: () => {
              this.router.navigate( ['/login'] );
            }
          }
        ]
      });
  
      await alert.present();
    }

}
