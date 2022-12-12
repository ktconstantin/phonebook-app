const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://kconstantin:${password}@persons.kbk4ska.mongodb.net/phonebookApp?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

mongoose.connect(url)

Person.find({}).then(result => {
  result.forEach(person => {
    console.log(person)
  })
  mongoose.connection.close()
})

// mongoose
//   .connect(url)
//   .then((result) => {
//     console.log('connected')

//     const person = new Person({
//       name: 'Bilbo Baggins',
//       number: '420-420'
//     })

//     return person.save()
//   })
//   .then(() => {
//     console.log('person saved!')
//     return mongoose.connection.close()
//   })
//   .catch((error) => console.log(error))