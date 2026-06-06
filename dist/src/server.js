import app from "./app.js";
import "dotenv/config";
import { prisma } from "./app/lib/prisma.js";
const port = process.env.PORT;
let server;
const startServer = async () => {
    try {
        await prisma.$connect();
        console.log("*** database connected successfully ***");
        server = app.listen(port, () => {
            console.log(`*** server is running on port: ${port} ***`);
        });
    }
    catch (error) {
        console.log("*** error on connecting database...");
    }
};
(async () => {
    await startServer();
})();
process.on("unhandledRejection", (err) => {
    console.log("server is closing... ");
    console.log(err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on("uncaughtException", (err) => {
    console.log("server is closing... ");
    console.log(err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on("SIGTERM", (err) => {
    console.log("server is closing... ");
    console.log(err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
