import { Component, OnInit } from "@angular/core";
import { Message } from "../message";
import { MessageService } from "../message.service";
import { MessageDetailsComponent } from "../message-details/message-details.component";

@Component({
  selector: "message-list",
  templateUrl: "./message-list.component.html",
  styleUrls: ["./message-list.component.css"],
  providers: [MessageService]
})

export class MessageListComponent implements OnInit {

  messages: Message[]
  selectedMessage: Message

  constructor(private messageService: MessageService) { }

  ngOnInit() {
    this.messageService
        .getMessages()
        .then((messages: Message[]) => {
          // If the database is empty on startup, there will be no messages to map
          if (messages !== undefined) {
            this.messages = messages.map((message) => {
              return message;
            });
          }
        });
  }

  private getIndexOfMessage = (messageId: String) => {
    return this.messages.findIndex((message) => {
      return message._id === messageId;
    });
  }

  selectMessage(message: Message) {
    this.selectedMessage = message
  }

  createNewMessage() {
    var message: Message = {
      text: "",
	    isPalindrome: false
    };
    // By default, a newly-created message will have the selected state
    this.selectMessage(message);
  }

  deleteMessage = (messageId: String) => {
    var idx = this.getIndexOfMessage(messageId);
    if (idx !== -1) {
      this.messages.splice(idx, 1);
      this.selectMessage(null);
    }
    return this.messages;
  }

  addMessage = (message: Message) => {
    this.messages.push(message);
    this.selectMessage(message);
    return this.messages;
  }
}