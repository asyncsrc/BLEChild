import {BLE, BatteryStatus} from 'ionic-native';
import {Observable} from "rxjs/Rx";

export class BluetoothService {
  constructor() {

  }

  public static connectDevice(deviceAddress:string):Observable<BLE> {
    alert("Connecting to device address: " + deviceAddress);
    return BLE.connect(deviceAddress);
  }

  public static scanDevices() {
    return BLE.scan([], 1);
  }
}

