class reminderView {
    showResponse(data) {
        if (Array.isArray(data)) {
            let response = [];

            for (let i = 0; i < data.length; i++) {
                response.push({"text": `id: ${data[i].userReminderId}
                 ${data[i].event}
                 ${data[i].dateInput} : ${data[i].timeInput}`})
            }

            return response
        } else if (typeof data === "string") {
            return [{"text": data}]
        } else if (typeof data === "object") {
            return [{"text": `${data.userReminderId} : ${data.event} : ${data.time}`}]
        }
    }
}

export default new reminderView();