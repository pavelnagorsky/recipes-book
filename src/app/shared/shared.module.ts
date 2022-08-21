import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { AlertComponent } from "./alert/alert.component";
import { DropdownDirective } from "./directives/dropdown.directive";
import { NavbarTogglerDirective } from "./directives/navbar-toggler.directive";
import { PlaceholderDirective } from "./directives/placeholder.directive";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner/loading-spinner.component";

@NgModule({
  declarations: [
    DropdownDirective,
    PlaceholderDirective,
    NavbarTogglerDirective,
    LoadingSpinnerComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CommonModule,
    DropdownDirective,
    NavbarTogglerDirective,
    PlaceholderDirective,
    LoadingSpinnerComponent
  ],
  entryComponents: [
    AlertComponent
  ]
})
export class SharedModule {}