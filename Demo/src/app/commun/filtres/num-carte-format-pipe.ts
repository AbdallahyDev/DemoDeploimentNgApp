import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'numCarteFormat' })
export class NumCarteFormatPipe implements PipeTransform {
    transform(numCarte: string): string {
        var res = "";
        if (numCarte.length > 1) {
            let s = numCarte.toString();
            let numCarteStr = this.pad(numCarte);
            res = numCarteStr.substring(0, 3) + " " + numCarteStr.substring(3, 6) + " " + numCarteStr.substring(6, 9) + " " + numCarteStr[numCarteStr.length - 1]
        }
        return res;
    }

    private pad(n: string, width: number = 10, z: string = ''): string {
        z = z || '0';
        let nStr = n + '';
        return nStr.length >= width ? nStr : new Array(width - nStr.length + 1).join(z) + nStr;
    }
}