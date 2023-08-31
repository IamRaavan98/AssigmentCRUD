// controllers/dataController.js
const fs = require('fs');
const csv = require('csv-parser');
const dataFilePath = './data/data.csv';

// Validate data before writing
const validateData = (data) => {
  if (!data?.id || !data?.firstName || !data?.lastName || !data?.email) {
    throw new Error('Data is missing required fields');
  }
  // You can add more validation checks here
};

const forUpdateValidateData = (data) => {
  if (!data) {
    throw new Error('Data is missing required fields');
  }
  // You can add more validation checks here
};
// Get all data
exports.getAllData = (req, res) => {
 try {
  const results = [];
  fs.createReadStream(dataFilePath)
    .pipe(csv())
    .on('data', (data) => {
      results.push(data);
    })
    .on('end', () => {
    return res.status(200).json(results)
    })
    .on('error', (error) => res.status(500).json({ error: 'Internal server error' }));
 } catch (error) {
  res.status(500).send(error?.message)
 }
};


// Create new data
exports.createData = async (req, res) => { // Add the async keyword
  try {
    const newData = req.body;
    validateData(newData);
    const existingData = [];
    return fs.createReadStream(dataFilePath) // Return the promise
      .pipe(csv())
      .on('data', (data) => existingData.push(data))
      .on('end', () => {
        existingData.push(newData);
        const writeStream = fs.createWriteStream(dataFilePath);
        writeStream.write(Object.keys(existingData[0]).join(',') + '\n'); // Write header
        existingData.forEach(item => {
          writeStream.write(Object.values(item).join(',') + '\n');
        });
        writeStream.end();
        res.json(newData); // Resolve the promise with the new data
      })
      .on('error', (error) => res.status(500).json({ error: 'Internal server error' })); // Catch and send back any file system errors
  } catch (error) {
    res.status(400).json({ error: error.message }); // Catch and send back any validation errors
  }
};


// Update data by ID
exports.updateData = (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    forUpdateValidateData(updatedData);

    const existingData = [];
    fs.createReadStream(dataFilePath)
      .pipe(csv())
      .on('data', (data) => existingData.push(data))
      .on('end', () => {
        const newData = existingData.map(item => {
          if (item.id === id) {
            return { ...item, ...updatedData };
          }
          return item;
        });
        const writeStream = fs.createWriteStream(dataFilePath);
        writeStream.write(Object.keys(existingData[0]).join(',') + '\n'); // Write header
        newData.forEach(item => {
          writeStream.write(Object.values(item).join(',') + '\n');
        });
        writeStream.end();

        res.json(updatedData);
      })
      .on('error', (error) => res.status(500).json({ error: 'Internal server error' }));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete data by ID
exports.deleteData = (req, res) => {
  const { id } = req.params;

  const existingData = [];
  fs.createReadStream(dataFilePath)
    .pipe(csv())
    .on('data', (data) => existingData.push(data))
    .on('end', () => {
      const newData = existingData.filter(item => item.id !== id);
      const writeStream = fs.createWriteStream(dataFilePath);
      writeStream.write(Object.keys(existingData[0]).join(',') + '\n'); // Write header
      newData.forEach(item => {
        writeStream.write(Object.values(item).join(',') + '\n');
      });
      writeStream.end();

      res.json({ message: 'Data deleted successfully' });
    })
    .on('error', (error) => res.status(500).json({ error: 'Internal server error' }));
};

// A function that validates the input data and throws an error if it is invalid
exports.validateData = (data) => {
  // Check if the data object has all the required fields
  if (!data.id || !data.firstName || !data.lastName || !data.email) {
    throw new Error('Invalid data');
  }
  // Check if the id field is a number
  if (isNaN(data.id)) {
    throw new Error('Invalid data');
  }
  // Check if the email field is a valid email address
  if (!/^[^@]+@[^@]+\.[^@]+$/.test(data.email)) {
    throw new Error('Invalid data');
  }
};
