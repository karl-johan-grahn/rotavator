import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { MessageDetailsComponent } from './messages/message-details/message-details.component';
import { MessageListComponent } from './messages/message-list/message-list.component';

@NgModule({
  declarations: [
    AppComponent,
    MessageDetailsComponent,
    MessageListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
