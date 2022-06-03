class reminderView {
    showResponse(data) {
        if (Array.isArray(data)) {
            let response = [];

            for (let i = 0; i < data.length; i++) {
                response.push({"text": `${data[i].userReminderId} : ${data[i].event} : ${data[i].time}`})
            }

            return response
        }else if (typeof data === "string") {
            return [{"text" : data}]
        }
    }
}

export default new reminderView();