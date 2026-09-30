import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  imports: [RouterOutlet, RouterLink, MatButtonModule, MatToolbarModule],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {}
