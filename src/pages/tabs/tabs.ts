import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { VideoPage } from '../video/video';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tabRoots: any;

  tab1Root = HomePage;
  tab2Root = ContactPage; 
  tab3Root = VideoPage;
  tab4Root = AboutPage;


  constructor() {

    this.tabRoots = [
      {
        root: HomePage,
        tabTitle: '首页',
        tabIcon: 'home'
      },
      {
        root: ContactPage,
        tabTitle: '任务',
        tabIcon: 'md-mail'
      },
      {
        root: VideoPage,
        tabTitle: '视频',
        tabIcon: 'md-mail'
      },
      {
        root: AboutPage,
        tabTitle: '我的',
        tabIcon: 'md-person'
      }
    ];


  }
}
