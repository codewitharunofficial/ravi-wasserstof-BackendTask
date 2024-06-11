import express from 'express'

const app = express();
app.use(express.json());
app.post('/', (req, res) => {
    setTimeout(() => res.send('Response from server 8081'), 100); // Simulate fast response
});
app.listen(8081, () => console.log('Server 8081 running'));


