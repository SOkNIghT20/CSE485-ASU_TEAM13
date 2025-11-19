import { NgModule } from '@angular/core';
import type { Routes} from '@angular/router';
import { RouterModule } from '@angular/router';
import { AdDebugComponent } from './components/ad-debug/ad-debug.component';

const routes: Routes = [
  { path: 'ad-debug', component: AdDebugComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
