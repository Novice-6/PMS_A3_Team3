import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton } from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton
  ],
})
export class Tab4Page implements OnInit {

  constructor(private alertController: AlertController) { }

  ngOnInit() {}


  async showHelp() {
    const alert = await this.alertController.create({
      header: 'Privacy & Security Policy Help',
      message: 'This page displays the complete official Privacy & Security Policy of the Inventory Management Application. It covers data protection, user privacy commitment, data usage rules, application security standards, and liability disclaimer in full compliance with academic and security specifications.',
      buttons: ['OK']
    });
    await alert.present();
  }
}