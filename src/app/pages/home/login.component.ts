import { Component } from '@angular/core'
import { Title, Meta } from '@angular/platform-browser'

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
})
export class Home {
  constructor(private title: Title, private meta: Meta) {
    this.title.setTitle('frontend login')
    this.meta.addTags([
      {
        property: 'og:title',
        content: 'frontend login',
      },
    ])
  }
  selectedOption: string | null = null;
  isToggled: boolean = false;

  selectOption(option: string) {
    this.selectedOption = option;
    this.isToggled = false;
  }
  toggleMenu(): void {
    this.isToggled = !this.isToggled;
  }
  clickedOutside(): void {
    this.isToggled = false;
  }
}
