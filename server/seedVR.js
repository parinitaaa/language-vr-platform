const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const VRScenario = require('./models/VRScenario');

const scenarios = [
  {
    title: 'Ordering Coffee',
    setting: 'coffee-shop',
    language: 'Spanish',
    level: 'Beginner',
    dialogue: [
      {
        npc: 'Buenos días, ¿qué desea tomar?',
        options: ['Un café con leche, por favor.', 'I want coffee please.', 'Gracias, adiós.'],
        correct: 0
      },
      {
        npc: '¿Grande o pequeño?',
        options: ['Sí, me gusta.', 'Grande, por favor.', 'No entiendo.'],
        correct: 1
      },
      {
        npc: 'Son tres euros. ¿Algo más?',
        options: ['Nada más, gracias.', 'Quiero dormir.', 'Dónde está el baño?'],
        correct: 0
      }
    ]
  },
  {
    title: 'Airport Check-In',
    setting: 'airport',
    language: 'Spanish',
    level: 'Beginner',
    dialogue: [
      {
        npc: 'Buenos días. ¿Puede mostrarme su pasaporte?',
        options: ['Aquí tiene mi pasaporte.', 'No tengo hambre.', 'Me llamo Carlos.'],
        correct: 0
      },
      {
        npc: '¿Lleva equipaje para facturar?',
        options: ['El avión es grande.', 'Sí, tengo una maleta.', 'No me gusta volar.'],
        correct: 1
      },
      {
        npc: 'Su puerta de embarque es la C4. ¿Necesita indicaciones?',
        options: ['Sí, ¿cómo llego a la puerta C4?', 'Quiero una hamburguesa.', 'El hotel está lejos.'],
        correct: 0
      }
    ]
  },
  {
    title: 'Market Shopping',
    setting: 'market',
    language: 'Spanish',
    level: 'Beginner',
    dialogue: [
      {
        npc: '¡Hola! ¿Qué busca hoy?',
        options: ['Estoy buscando manzanas.', 'Me llamo Ana.', 'Hace calor hoy.'],
        correct: 0
      },
      {
        npc: 'Tenemos manzanas frescas. ¿Cuántas quiere?',
        options: ['Mañana es lunes.', 'Quiero un kilo, por favor.', 'No me gustan las frutas.'],
        correct: 1
      },
      {
        npc: 'Son dos euros el kilo. ¿Le parece bien el precio?',
        options: ['Sí, me parece bien. Me los llevo.', 'El mercado es bonito.', 'Prefiero el supermercado.'],
        correct: 0
      }
    ]
  }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/language-platform');
    console.log('MongoDB Connected');

    await VRScenario.deleteMany({});
    await VRScenario.insertMany(scenarios);

    console.log('VR Scenarios seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
};

seed();
