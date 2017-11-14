import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'etatSignification' })
export class EtatSignificationPipe implements PipeTransform {
    transform(etatValueNum: number): string {
        return etatValueNum ===1 ? "En cours" : "Clôturée";
    }
}