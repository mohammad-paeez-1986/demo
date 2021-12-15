import { store } from "react-notifications-component";

class NotifyCass {
  constructor() {
    this.durationTime = 3000;
  }

  create = () => {
    store.addNotification({
      message: this.message,
      type: this.type,
      insert: "top",
      container: "bottom-center",
      animationIn: ["animate__animated", "animate__flipInX"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: this.durationTime,
        onScreen: true,
      },
    });
  };

  duration = (time) => {
      this.durationTime = time;
      return this;
  }
  

  success = (message) => {
    this.message = message;
    this.type = "success";

    this.create();
  };

  error = (message) => {
    this.type = "danger";
    this.message = message;

    this.create();
  };

  warning = (message) => {
    this.message = message;
    this.type = "warning";

    this.create();
  };
}

const notify = new NotifyCass();
export default notify;
