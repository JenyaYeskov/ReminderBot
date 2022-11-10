export function applyHooks(db, connection) {
    try {
        db.on("connected", () => {
            console.log(`Connected to ${connection.name}`);
        });

        process.on("SIGINT", () => {
            db.close(() => {
                console.log(`${connection.name} disconnected through app termination`);
                process.exit(0);
            });
        });
    } catch (e) {
        console.error(e);
    }
}