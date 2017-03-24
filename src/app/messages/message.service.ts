import { Injectable } from "@angular/core";
import { Message } from "./message";
import { Http, Response } from "@angular/http";
import "rxjs/add/operator/toPromise";

// Service acting as the client-side wrapper for the RESTful API endpoints that the web application needs

@Injectable()
export class MessageService {
  private messagesUrl = "/messages";

  constructor (private http: Http) {}

  // get("/messages")
  getMessages(): Promise<Message[]> {
    return this.http.get(this.messagesUrl)
               .toPromise()
               .then(response => response.json() as Message[])
               .catch(this.handleError);
  }

  // post("/messages")
  createMessage(newMessage: Message): Promise<Message> {
    return this.http.post(this.messagesUrl, newMessage)
               .toPromise()
               .then(response => response.json() as Message)
               .catch(this.handleError);
  }

  // get("/messages/:id") endpoint not used by the Angular app

  // delete("/messages/:id")
  deleteMessage(delMessageId: String): Promise<String> {
    return this.http.delete(this.messagesUrl + "/" + delMessageId)
               .toPromise()
               .then(response => response.json() as String)
               .catch(this.handleError);
  }

  private handleError (error: any) {
    let errMsg = (error.message) ? error.message :
    error.status ? `${error.status} - ${error.statusText}` : "Server error";
    console.error(errMsg); // log to console instead
  }
}