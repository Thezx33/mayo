import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { SaleService } from '../../services/sale.service';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.page.html',
  styleUrls: ['./sale.page.scss'],
})
export class SalePage implements OnInit {

  constructor(
    private menu: MenuController,
    private saleService: SaleService
  ) {

  }

  ngOnInit() {
    // Evita que el menú se abra arrastrando
    this.menu.swipeGesture( false, 'first');
  }

  // Abrir menú
  onToggleMenu() {
    this.menu.enable( true, 'first');
    this.menu.open('first');
  }

  getProductByBarCode( barCode: string ) {
    this.saleService.getProductByBarCode( barCode );
  }
}
