import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
    {
        id: 1,
        image: "https://picsum.photos/id/102/4320/3240",
        name: "Castle T-Shirt",
        price: 1250,
        description:
            "Beware the castle of the blue wizard of Bazmagar! It is said that he has a dragon!",
    },
    {
        id: 2,
        image: "https://picsum.photos/id/103/2592/1936",
        name: "Dragon T-Shirt",
        price: 2500,
        description:
            "This dragon is not to be trifled with, his fire has burned many enemies to ash!",
    },
    {
        id: 3,
        image: "https://picsum.photos/id/104/3840/2160",
        name: "Elf T-Shirt",
        price: 2050,
        description:
            "This fierce elf is ready to take on any foe, with her trusty bow and arrow!",
    },
    {
        id: 4,
        image: "https://picsum.photos/id/106/2592/1728",
        name: "Wizard T-Shirt",
        price: 2005,
        description:
            "This wizard is ready to cast a spell on you, and it won't be a good one!",
    },
    {
        id: 5,
        image: "https://picsum.photos/id/107/5000/3333",
        name: "Goblin T-Shirt",
        price: 5200,
        description:
            "The goblin is powerful and knows many dangerous spells, beware traveller!",
    },
    {
        id: 6,
        image: "https://picsum.photos/id/108/2000/1333",
        name: "Barbarian T-Shirt",
        price: 5020,
        description:
            "This barbarian is ready to take on any foe, with his trusty broadsword!",
    },
];

async function main() {
    for (const product of products) {
        await prisma.product.create({
            data: {
                id: product.id,
                image: product.image,
                name: product.name,
                price: product.price,
                description: product.description,
            },
        });
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
