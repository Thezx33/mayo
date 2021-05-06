import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuController, AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ValidatorService } from '../../services/validator.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  // Patrones
  namePattern: string = '[a-zA-Z ]{3,50}';
  emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

  constructor( private formBuilder: FormBuilder,
               private menu: MenuController,
               private alertCtrl: AlertController,
               private router: Router,
               private authService: AuthService,
               private validatorService: ValidatorService ) {
                this.menu.enable( false, 'first' );
              }

  form: FormGroup = this.formBuilder.group({
    name: [ '', [ Validators.required, Validators.minLength( 3 ), Validators.pattern( this.namePattern) ] ],
    lastName: [ '', [ Validators.required, Validators.minLength( 3 ), Validators.pattern( this.namePattern ) ] ],
    email: [ '', [ Validators.required, Validators.pattern( this.emailPattern ) ], ],
    phone: [ '', [ Validators.required, Validators.minLength( 8 ) ] ],
    password: [ '', [ Validators.required, Validators.minLength( 6 ), Validators.maxLength( 20 ) ] ],
    password2: [ '', ]
  },{
    validators: [ this.validatorService.camposIguales( 'password', 'password2' ) ]
  });

  // Mensajes de error del nombre.
  get nameErrorMsg(): string {
    const errors = this.form.get( 'name' )?.errors;
    if( errors?.required ) {
      return 'El nombre es obligatorio.';
    } else if ( errors?.minlength ) {
      return 'El nombre debe contener mínimo 3 caracteres.';
    } else if ( errors?.pattern ) {
      return 'El nombre no es válido.';
    }
    return '';
  }

  // Mensajes de error del apellido.
  get lastNameErrorMsg(): string {
    const errors = this.form.get( 'lastName' )?.errors;
    if( errors?.required ) {
      return 'El apellido es obligatorio.';
    } else if( errors?.minlength ) {
      return 'El apellido debe contener mínimo 3 caracteres.';
    } else if( errors?.pattern ) {
      return 'El apellido no es válido';
    }
    return '';
  }

  // Mensajes de error del correo
  get emailErrorMsg(): string {
    const errors = this.form.get( 'email' )?.errors;
    if( errors?.required ) {
      return 'El correo es obligatorio.';
    } else if( errors?.pattern ) {
      return 'El formato del correo no es válido.'
    }
    return '';
  }

  // Mensajes de error del teléfono
  get phoneErrorMsg(): string {
    const errors = this.form.get( 'phone' )?.errors;
    if ( errors?.required ) {
      return 'El teléfono es obligatorio';
    } else if ( errors?.minlength ) {
      return 'El teléfono debe contener mínimio 8 caracteres.';
    } // TODO: Patrón.
    return '';
  }

  // Mensajes de error de la contraseña
  get passwordErrorMsg(): string {
    const errors = this.form.get( 'password' )?.errors;
    if ( errors?.required ) {
      return 'La contraseña es obligatoria.';
    } else if ( errors?.minlength ) {
      return 'La contraseña debe contener mínimo 6 caracteres.';
    } else if( errors?.maxlength ) {
      return 'La contraseña debe contener máximo 20 caracteres.';
    }
    return '';
  }

  // Mensaje de error para confirmar la contraseña
  get confirmPasswordErrorMsg(): string {
    const errors = this.form.get( 'password2' )?.errors;
    if ( errors?.noIguales !== false ) {
      return 'Las contraseñas no son iguales.';
    }
    console.log( errors );
    return '';
  }
  ngOnInit() {
  }

  // Registrar usuario.
  async onRegister() {

    const { email, password } = this.form.value;

    const userForm = this.form.value;
    delete userForm.password;
    delete userForm.password2;

    try {
      if ( !this.form.valid ) {
        this.form.markAllAsTouched();
        return;
      }
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
        // this.authService.addUser( userData );
      }
    } catch ( err ) {
      console.log("🚀 ~ file: register.page.ts ~ line 40 ~ RegisterPage ~ onRegister ~ err", err);
    }

  }

  // Mensajes de errores
  campoNoValido( campo: string ) {
    return this.form.get( campo )?.invalid
          && this.form.get( campo )?.touched;
  }

  // Alerta de verificar correo.
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
