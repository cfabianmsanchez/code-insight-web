import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "@shared/components/header/header.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <div class="app-layout">
      <app-header></app-header>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
      .app-layout {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }
      .main-content {
        flex: 1;
        padding: 32px 0 64px 0;
      }
    `,
  ],
})
export class AppComponent {}
