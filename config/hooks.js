export function applyHooks(db, connection) {
    db.on('connected', () => {
        console.log(`Connected to ${connection.name}`);
        connection.failsCount = 0;
    });

    process.on('SIGINT', () => {
        db.close(function () {
            console.log(`${connection.name} disconnected through app termination`);
            process.exit(0);
        });
    });
}