import { Component, Input } from "@angular/core";
import { Message } from "../message";
import { MessageService } from "../message.service";

@Component({
  selector: "message-details",
  templateUrl: "./message-details.component.html",
  styleUrls: ["./message-details.component.css"]
})

export class MessageDetailsComponent {
  @Input()
  message: Message;

  @Input()
  createHandler: Function;
  @Input()
  deleteHandler: Function;

  constructor (private messageService: MessageService) {}

  createMessage(message: Message) {
    this.messageService.createMessage(message).then((newMessage: Message) => {
      this.createHandler(newMessage);
    });
  }

  deleteMessage(messageId: String): void {
    this.messageService.deleteMessage(messageId).then((deletedMessageId: String) => {
      this.deleteHandler(deletedMessageId);
    });
  }
}