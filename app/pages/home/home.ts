import {Component, OnInit, ChangeDetectorRef, } from "@angular/core";
import {BluetoothService} from '../../services/bluetooth';
import {Vibration} from 'ionic-native';

@Component({
  templateUrl: 'build/pages/home/home.html',
  providers: [BluetoothService]
})

export class HomePage implements OnInit {
  foundDevices : any[];
  vibrationThreshold: number;

  constructor(private cd: ChangeDetectorRef) {
  }

  scanDevices() : void {
    BluetoothService.scanDevices().subscribe(
      device => {

        if (device.rssi <= -95) {
          this.vibrationThreshold += 1;
          device.distance = "far";
        } else if (device.rssi > -95 && device.rssi <= -80) {
          this.vibrationThreshold += 1;
          device.distance = "not so close";
        } else if (device.rssi > -80) {
          this.vibrationThreshold = 0;
          device.distance = "close";
        }

        if (this.vibrationThreshold >= 3) {
          console.log("Attempting to vibrate...");
          Vibration.vibrate(2000);
        }

        this.foundDevices.push(device);
        console.log("Found: " + JSON.stringify(device));

        // It seems I need to use the ChangeDetectorRef to get the UI to update whenever a device is detected
        this.cd.detectChanges();

      },
      err => console.log(err));
  }

  connectDevice(deviceAddress: string) : void {
    BluetoothService.connectDevice(deviceAddress).subscribe(
      connect => {
        alert("Successfully connected to: " + deviceAddress);
      },
      disconnect => {
        alert("Disconnected from device: " + deviceAddress);
      }
    )
  }

  ngOnInit() : void {
    this.foundDevices = [];
    this.vibrationThreshold = 0;
    setInterval(() => {

      // I need to keep resetting foundDevices, so our UI isn't filled up with the same device as we scan repeatedly
      this.foundDevices = [];
      this.scanDevices();
    }, 1500);
  }
}
