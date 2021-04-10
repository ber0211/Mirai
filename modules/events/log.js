module.exports.config = {
	name: "log",
	eventType: ["log:unsubscribe","log:subscribe","log:thread-name"],
	version: "1.0.0",
	credits: "CatalizCS",
	description: "Ghi lại thông báo các hoạt đông của bot!",
    envConfig: {
        enable: true
    }
};

module.exports.run = async function({ api, event, Users, Threads, client, __GLOBAL }) {
    if (__GLOBAL[this.config.name].enable != true) return;
    console.log((__GLOBAL[this.config.name].enable == false))
    var formReport =  "=== Bot Notification ===" +
                        "\n\n» Thread mang ID: " + event.threadID +
                        "\n» Hành động: {task}" +
                        "\n» Hành động được tạo bởi userID: " + event.author +
                        "\n» " + Date.now() +" «",
        task = "";
    switch (event.logMessageType) {
        case "log:thread-name": {
            const oldName = (await Threads.getData(event.threadID)).name || "Tên không tồn tại",
                    newName = event.logMessageData.name || "Tên không tồn tại";
            task = "Người dùng thay đổi tên nhóm từ: '" + oldName + "' thành '" + newName + "'";
            await Threads.setData(event.threadID, {name: newName});
            break;
        }
        case "log:subscribe": {
            if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) task = "Người dùng đã thêm bot vào một nhóm mới!";
            break;
        }
        case "log:unsubscribe": {
            if (event.logMessageData.leftParticipantFbId== api.getCurrentUserID()) task = "Người dùng đã kick bot ra khỏi nhóm!"
            break;
        }
    }

    formReport = formReport
    .replace(/\{task}/g, task);

    console.log(formReport);

    return api.sendMessage(formReport, __GLOBAL.settings.ADMINBOT.split(" ")[0]);
}