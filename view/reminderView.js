class reminderView {
    showResponse(data) {

        if (Array.isArray(data)) {
            let response = [];

            for (let i = 0; i < data.length; i++) {
                response.push({"text": `id: ${data[i].userReminderId}\n"${data[i].event}"\n${data[i].dateInput} : ${data[i].timeInput}`});
            }

            return response;
        }

        if (typeof data === "string") {
            return [{"text": data}];
        }

        if (typeof data === "object") {
            return [{"text": `Done. Reminder "${data.event}" with id: ${data.userReminderId} ${data.message}`}];
        }
    }
}

export default new reminderView();