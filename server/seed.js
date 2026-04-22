const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Course = require('./models/Course');
const Lesson = require('./models/Lesson');
const Quiz = require('./models/Quiz');
const bcrypt = require('bcryptjs');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/language-platform');
    console.log('MongoDB Connected for Seeding');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Course.deleteMany();
    await Lesson.deleteMany();
    await Quiz.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    });

    const testUser = await User.create({
      name: 'Test User',
      email: 'user@example.com',
      password: hashedPassword,
      role: 'user'
    });

    const course1 = await Course.create({
      title: 'Spanish for Beginners',
      language: 'Spanish',
      level: 'Beginner',
      description: 'Learn the basics of Spanish, including greetings, numbers, and simple phrases.',
      createdBy: adminUser._id
    });

    const course2 = await Course.create({
      title: 'Advanced French Conversation',
      language: 'French',
      level: 'Advanced',
      description: 'Master French conversation with complex topics and idiomatic expressions.',
      createdBy: adminUser._id
    });

    const lesson1 = await Lesson.create({
      title: 'Greetings and Introductions',
      content: 'In this lesson, you will learn how to say hello and introduce yourself in Spanish. "Hola" means Hello. "Me llamo..." means My name is...',
      videoUrl: 'https://www.youtube.com/embed/PZJev_WdCjw',
      level: 'Beginner',
      courseId: course1._id,
      order: 1
    });

    const lesson2 = await Lesson.create({
      title: 'Numbers 1-10',
      content: 'Learn to count from 1 to 10 in Spanish: uno, dos, tres, cuatro, cinco, seis, siete, ocho, nueve, diez.',
      videoUrl: 'https://www.youtube.com/embed/6FEyfy5N3Nc',
      level: 'Beginner',
      courseId: course1._id,
      order: 2
    });

    await Quiz.create({
      question: 'How do you say "Hello" in Spanish?',
      options: ['Adios', 'Hola', 'Gracias', 'Por favor'],
      correctAnswer: 'Hola',
      lessonId: lesson1._id
    });

    await Quiz.create({
      question: 'What is the Spanish word for the number 3?',
      options: ['uno', 'dos', 'tres', 'cuatro'],
      correctAnswer: 'tres',
      lessonId: lesson2._id
    });

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
