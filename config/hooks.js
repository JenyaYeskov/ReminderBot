export function applyHooks(db, connection) {
    db.on('connected', function () {
        console.log(`Connected to ${connection.name}`);
        connection.failsCount = 0;
    });

    db.on("error", async () => {
        console.log("failed");
        connection.failsCount += 1;
        console.log(connection.failsCount)

        if (connection.failsCount <= 3) {
            console.log(`reconnecting.............`);
            await connection.connect()
        } else {
            console.log("fuck of!!!!!!!!!!!!!!!!!1")
        }
    });

    process.on('SIGINT', function() {
        db.close(function () {
            console.log(`${connection.name} disconnected through app termination`);
            process.exit(0);
        });
    });

}