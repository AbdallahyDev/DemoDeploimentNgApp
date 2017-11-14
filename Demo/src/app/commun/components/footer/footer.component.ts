import { Component } from '@angular/core';
import { AuthService } from '../../services/authentification/AuthService';

@Component({
  selector: 'footers',
  templateUrl: './footer.template.html',
  styleUrls: ['./footer.style.css']
})

/**
 * Classe représentant le footer de la page
 */
export class Footer {
    constructor(private authService: AuthService) {

    }
}
