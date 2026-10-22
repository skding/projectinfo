const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createUser() {
    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.log('Usage: node scripts/create-user.js <email> <password> [name] [role]');
        console.log('Example: node scripts/create-user.js user@example.com mysecret "John Doe" USER');
        return;
    }

    const email = args[0];
    const password = args[1];
    const name = args[2] || null;
    const role = args[3] || 'USER';

    try {
        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                name,
                role
            }
        });

        console.log(`✅ Success! Created user: ${user.email} (ID: ${user.id})`);
    } catch (error) {
        if (error.code === 'P2002') {
            console.error('❌ Error: A user with this email already exists.');
        } else {
            console.error('❌ Error creating user:', error);
        }
    } finally {
        await prisma.$disconnect();
    }
}

createUser();
