const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('public'));

let trades = [];
let stats = { balance: 0, todayProfit: 0, totalTrades: 0 };

app.post('/api/ea/report', (req,res)=>{
  const {type, symbol, msg, profit, balance, time} = req.body;
  trades.unshift({type,symbol,msg,profit,balance,time: new Date().toLocaleString('id-ID')});
  if(trades.length>100) trades.pop();
  if(type==='CLOSE'){ stats.todayProfit+=profit; stats.totalTrades++; }
  if(balance) stats.balance=balance;
  console.log(`[EA] ${type} ${symbol} ${msg}`);
  // Di sini nanti bisa kirim ke WhatsApp mas via WA Gateway
  res.json({ok:true});
});

app.get('/api/ea/status', (req,res)=>{
  res.json({stats, trades: trades.slice(0,20)});
});

app.post('/api/ea/control', (req,res)=>{
  // untuk ON/OFF EA dari HP
  res.json({command: req.body.command}); // EA akan polling ini
});

app.listen(3000, ()=>console.log('Dashboard EA jalan'));