import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Create default admin credentials
    const email = 'admin@derakhtekherad.com';
    const password = 'Admin123!';
    const name = 'Admin User';
    
    console.log('Creating admin user...');
    
    // Hash the password
    const hashedPassword = await hash(password, 10);
    
    // Create the user with admin role
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'ADMIN',
      },
    });
    
    console.log('Created user:', user);
    
    // Create admin profile
    const admin = await prisma.admin.create({
      data: {
        userId: user.id,
      },
    });
    
    console.log('Created admin profile:', admin);
    console.log('\nLogin credentials:');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('\nPlease change the password after first login.');
    
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin(); 