import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonLabel } from '@ionic/angular/standalone';
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
    IonButton,
    IonLabel
  ],
})
export class Tab4Page implements OnInit {
  constructor(private alertController: AlertController) {}

  ngOnInit() {}

  async showHelp() {
    const alert = await this.alertController.create({
      header: 'Help',
      message: 'This page displays the complete Privacy & Security Policy of the inventory management application.',
      buttons: ['OK']
    });
    await alert.present();
  }
}
