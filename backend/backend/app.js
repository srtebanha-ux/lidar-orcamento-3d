const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();

app.use(cors());
app.use(express.json());

const leadsFile = './leads.json';

// Salva lead no arquivo JSON
app.post('/api/leads', (req, res) => {
  const newLead = req.body;
  let leads = [];
  if (fs.existsSync(leadsFile)) {
    leads = JSON.parse(fs.readFileSync(leadsFile));
  }
  leads.push(newLead);
  fs.writeFileSync(leadsFile, JSON.stringify(leads, null, 2));
  res.json({ message: 'Lead salvo com sucesso' });
});

app.get('/api/leads', (req, res) => {
  if (fs.existsSync(leadsFile)) {
    const leads = JSON.parse(fs.readFileSync(leadsFile));
    res.json(leads);
  } else {
    res.json([]);
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
