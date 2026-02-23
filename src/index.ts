import { app } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./config/prisma.js"

const startServer = async () => {
    try {
        await Promise.all([prisma.$connect()]);
        console.log("DB connected");
        
        app.listen(env.PORT || 8000, () => {
            console.log(`Server is Listening at port: ${env.PORT}`);
            
        });
    } catch (err) {
        console.log("DB connection failed !!!" + err);
    }
}

startServer();