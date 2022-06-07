class reminderView {
    showResponse(data) {
        if (Array.isArray(data)) {
            let response = [];
            let re = [];

            for (let i = 0; i < data.length; i++) {
                response.push({"text": `${data[i].userReminderId} : ${data[i].event} : ${data[i].time}`})
            }
            re.push(response)
            re.push(response)

            return re
        } else if (typeof data === "string") {
            return [{"text": data}]
        } else if (typeof data === "object") {
            return [{"text": `${data.userReminderId} : ${data.event} : ${data.time}`}]
        }
    }
}

export default new reminderView();