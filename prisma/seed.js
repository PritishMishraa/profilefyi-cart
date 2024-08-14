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
        reviews: [
            {
                rating: 5,
                text: "This is the best t-shirt I've ever owned! The design is amazing and the quality is top-notch.",
            },
            {
                rating: 4,
                text: "I really like this t-shirt, the design is cool and it's comfortable to wear. The only downside is that it shrunk a bit after washing.",
            },
        ],
    },
    {
        id: 2,
        image: "https://picsum.photos/id/103/2592/1936",
        name: "Dragon T-Shirt",
        price: 2500,
        description:
            "This dragon is not to be trifled with, his fire has burned many enemies to ash!",
        reviews: [
            {
                rating: 5,
                text: "I love this t-shirt! The dragon design is awesome and the material is high-quality.",
            },
            {
                rating: 5,
                text: "This is my new favorite t-shirt! The dragon design is so cool and the fit is perfect.",
            },
        ],
    },
    {
        id: 3,
        image: "https://picsum.photos/id/104/3840/2160",
        name: "Elf T-Shirt",
        price: 2050,
        description:
            "This fierce elf is ready to take on any foe, with her trusty bow and arrow!",
        reviews: [
            {
                rating: 4,
                text: "I really like this t-shirt, the elf design is unique and the fabric is soft. The only downside is that it's a bit too long for my liking.",
            },
            {
                rating: 5,
                text: "This t-shirt is amazing! The elf design is so cool and the fit is perfect. I've gotten so many compliments on it.",
            },
        ],
    },
    {
        id: 4,
        image: "https://picsum.photos/id/106/2592/1728",
        name: "Wizard T-Shirt",
        price: 2005,
        description:
            "This wizard is ready to cast a spell on you, and it won't be a good one!",
        reviews: [
            {
                rating: 5,
                text: "This t-shirt is awesome! The wizard design is so cool and the material is high-quality.",
            },
            {
                rating: 4,
                text: "I really like this t-shirt, the wizard design is unique and the fabric is soft. The only downside is that it's a bit too tight around the neck.",
            },
        ],
    },
    {
        id: 5,
        image: "https://picsum.photos/id/107/5000/3333",
        name: "Goblin T-Shirt",
        price: 5200,
        description:
            "The goblin is powerful and knows many dangerous spells, beware traveller!",
        reviews: [
            {
                rating: 5,
                text: "This is the best t-shirt I've ever owned! The goblin design is amazing and the quality is top-notch.",
            },
            {
                rating: 5,
                text: "I love this t-shirt! The goblin design is so cool and the fit is perfect. I wear it all the time.",
            },
        ],
    },
    {
        id: 6,
        image: "https://picsum.photos/id/108/2000/1333",
        name: "Barbarian T-Shirt",
        price: 5020,
        description:
            "This barbarian is ready to take on any foe, with his trusty broadsword!",
        reviews: [
            {
                rating: 4,
                text: "I really like this t-shirt, the barbarian design is unique and the fabric is soft. The only downside is that it's a bit too baggy.",
            },
            {
                rating: 5,
                text: "This t-shirt is amazing! The barbarian design is so cool and the fit is perfect. I've gotten so many compliments on it.",
            },
        ],
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
                reviews: {
                    create: product.reviews.map(review => ({
                        rating: review.rating,
                        text: review.text,
                    })),
                },
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
