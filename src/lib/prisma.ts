import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
    return new PrismaClient();
};

declare global {
    // eslint-disable-next-line no-var
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if(process.env.NODE_ENV === "development") {
    globalThis.prismaGlobal = prisma;
}