import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { interceptors } from './shared/Interceptors';	

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    RouterModule
  ],
  providers: [
    provideClientHydration(withEventReplay()), 
    provideHttpClient(
      withInterceptors(interceptors), 
      withFetch()
    )
  ],
  
  
  bootstrap: [AppComponent]
})
export class AppModule { }
