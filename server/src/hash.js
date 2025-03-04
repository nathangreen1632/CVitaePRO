import bcrypt from 'bcrypt';

const hashPassword = async () => {
    const hashedPassword = await bcrypt.hash('NewSecurePass456', 12);
    console.log('Hashed Password:', hashedPassword);
};

hashPassword();
