import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ 
  name: 'textbreak'
})
export class TextBreakPipe implements PipeTransform {
  transform(value: string): string {
    return value.replaceAll('\n', "\n");
  }
}