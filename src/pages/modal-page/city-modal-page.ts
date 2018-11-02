import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
    templateUrl: 'city-modal-page.html'
})
export class CityModalPage {

    currentProvince: any;
    currentCity: any;
    currentRegion: any;
    currentStreet: any;
    city: any;
    provinceList = [];
    cityList = [];
    regionList = [];
    streetList = [];

    constructor(
        public viewCtrl: ViewController,
        params: NavParams
    ) {

        this.provinceList = params.get('cityList');
        this.currentCity = params.get('currentCity');
        this.currentProvince = this.provinceList[0];
        this.cityList = this.provinceList[0].children;
        console.log(this.currentCity)
        this.regionList = this.currentCity.children;

        const currentProvince = params.get('currentProvince');
        const currentCity = params.get('currentCity');
        const currentRegion = params.get('currentRegion');
        const currentStreet = params.get('currentStreet');
        if (currentProvince) {
            this.currentProvince = currentProvince;    
            this.cityList = this.provinceList[0].children;
        }
        if (currentCity) {
            this.currentCity = currentCity;
            this.regionList = this.currentCity.children;
        }
        if (currentRegion) {
            this.currentRegion = currentRegion;
            this.streetList = this.currentRegion.children;
        }
        if (currentStreet) {
            this.currentStreet = currentStreet;
        }
    }

    dismissOk() {
        let data = { 'city': this.city, 'currentProvince': this.currentProvince, 'currentCity': this.currentCity, 'currentRegion': this.currentRegion, 'currentStreet': this.currentStreet};
        this.viewCtrl.dismiss(data);
        // this.viewCtrl.dismiss();
    }
    dismissClose() {
        this.viewCtrl.dismiss();
    }

    selecteProvince(province) {
        // console.log(province);
        this.city = province;
        this.currentProvince = province;
        this.cityList = province.children;
        this.currentCity = '';
        this.currentRegion = '';
        this.currentStreet = '';
    }

    selecteCity(city) {
        // console.log(city);
        this.city = city;
        this.currentCity = city;
        this.regionList = city.children;
        this.currentRegion = '';
        this.currentStreet = '';
    }

    selecteRegion(region) {
        // console.log(region);
        this.city = region;
        this.currentRegion = region;
        this.streetList = region.children;
        this.currentStreet = '';
    }

    selecteStreet(street) {
        // console.log(street);
        this.city = street;
        this.currentStreet = street;
    }
}