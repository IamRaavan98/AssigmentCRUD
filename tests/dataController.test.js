const expect = require('chai').expect;
const sinon = require('sinon');
const fs = require('fs');
const { Readable,Writable } = require('stream');
const dataController = require('../controllers/user');
const csv = require('csv-parser');
describe('Data Controller - getAllData', () => {
  let createReadStreamStub;

  beforeEach(() => {
    createReadStreamStub = sinon.stub(fs, 'createReadStream');
  });

  afterEach(() => {
    createReadStreamStub.restore();
  });

  it('should return all data from the CSV file', (done) => {
    let mockData = [
      { id: '1', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
      { id: '2', firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com' }
    ];

  
 
    let csvContent = 'id,firstName,lastName,email\n';
    mockData.forEach(item => {
      csvContent += `${item.id},${item.firstName},${item.lastName},${item.email}\n`;
    });
    // console.log(csvContent);
     
  

    const readStream = Readable.from(csvContent);
    createReadStreamStub.returns(readStream);
    const response = {
      json: (data) => {
        try {
          expect(data).to.deep.equal(mockData);
          done();
        } catch (error) {
          done(error);
        }
      }
    };
  
    dataController.getAllData({}, response);
  });
  

  it('should handle an empty CSV file', (done) => {
    const readStream = Readable.from(''); // Empty readable stream
    createReadStreamStub.returns(readStream);

    const response = {
      json: (data) => {
        try {
          expect(data).to.deep.equal([]);
          done();
        } catch (error) {
          done(error);
        }
      }
    };

    const clock = sinon.useFakeTimers();
    dataController.getAllData({}, response);
    clock.tick(1000);
    clock.restore();
  });

  
});

describe('Data Controller - createData', () => {
  let createReadStreamStub;
  let createWriteStreamStub;

  beforeEach(() => {
    createReadStreamStub = sinon.stub(fs, 'createReadStream');
    createWriteStreamStub = sinon.stub(fs, 'createWriteStream');
  });

  afterEach(() => {
    createReadStreamStub.restore();
    createWriteStreamStub.restore();
  });

  it('should write new data to the CSV file', async () => {
    const req = {
      body: { id: '3', firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com' }
    };

    const readStream = new Readable({
      read: async function() {
        try {
          const data = await asyncReadData();
          this.push(data);
        } catch (error) {
          this.emit('error', error);
        }
      }
    });

    const writeStream = new Writable({
      write: function(chunk, encoding, next) {
        // Simulate writing to the stream using fs.write
        fs.write(someFileDescriptor, chunk, (error) => {
          if (error) {
            throw error; // Throw the error for assertion
          }
          next();
        });
      }
    });

    createReadStreamStub.returns(readStream); // Use the custom Readable stream
    createWriteStreamStub.returns(writeStream);

    const response = {
      json: (data) => {
        try {
          expect(data).to.deep.equal(req.body);
        } catch (error) {
          throw error; // Throw the error for assertion
        }
      },
      status: function(statusCode) {
        return this;
      }
    };
   // Set timeout limit to 5000ms

    // Wrap the test logic in a promise
    dataController.createData({}, response);
    
  });

  
  
  // Add more test cases here
});









