import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor( private formBuilder: FormBuilder ) { }

  form: FormGroup = this.formBuilder.group({
    
  })

  ngOnInit() {
  }

}
